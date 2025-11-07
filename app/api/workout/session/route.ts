import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/workout/session
 * Get active workout session or session for specific date
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (date) {
      // Get session for specific date
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('email', email)
        .eq('date', date)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching session:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      return NextResponse.json({ session: data })
    } else {
      // Get active session (in_progress or paused)
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('email', email)
        .in('status', ['in_progress', 'paused'])
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching active session:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      return NextResponse.json({ session: data })
    }
  } catch (error) {
    console.error('Error in workout session GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/workout/session
 * Start a new workout session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, date, dayOfWeek, workoutName, targetDuration } = body

    if (!email || !date || !dayOfWeek || !workoutName || !targetDuration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if there's already an active session
    const { data: existingSession } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('email', email)
      .in('status', ['in_progress', 'paused'])
      .maybeSingle()

    if (existingSession) {
      return NextResponse.json(
        { error: 'Active session already exists', session: existingSession },
        { status: 409 }
      )
    }

    // Create new session
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        email,
        date,
        day_of_week: dayOfWeek,
        workout_name: workoutName,
        target_duration_minutes: targetDuration,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    return NextResponse.json({ success: true, session: data })
  } catch (error) {
    console.error('Error in workout session POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/workout/session
 * Update workout session (pause, resume, finish)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, action } = body // action: 'pause' | 'resume' | 'finish'

    if (!sessionId || !action) {
      return NextResponse.json(
        { error: 'Session ID and action are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current session
    const { data: session, error: fetchError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (fetchError || !session) {
      console.error('Error fetching session:', fetchError)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (action === 'pause') {
      if (session.status !== 'in_progress') {
        return NextResponse.json(
          { error: 'Can only pause in_progress sessions' },
          { status: 400 }
        )
      }

      updateData.status = 'paused'
      updateData.paused_at = new Date().toISOString()
    } else if (action === 'resume') {
      if (session.status !== 'paused') {
        return NextResponse.json(
          { error: 'Can only resume paused sessions' },
          { status: 400 }
        )
      }

      // Calculate pause duration and add to total
      const pausedAt = new Date(session.paused_at!)
      const now = new Date()
      const pauseDurationSeconds = Math.floor((now.getTime() - pausedAt.getTime()) / 1000)

      updateData.status = 'in_progress'
      updateData.paused_at = null
      updateData.total_pause_duration_seconds = (session.total_pause_duration_seconds || 0) + pauseDurationSeconds
    } else if (action === 'finish') {
      if (session.status === 'completed') {
        return NextResponse.json(
          { error: 'Session already completed' },
          { status: 400 }
        )
      }

      const now = new Date()
      const startedAt = new Date(session.started_at)

      // If currently paused, add final pause duration
      let totalPauseDuration = session.total_pause_duration_seconds || 0
      if (session.status === 'paused' && session.paused_at) {
        const pausedAt = new Date(session.paused_at)
        const finalPauseDuration = Math.floor((now.getTime() - pausedAt.getTime()) / 1000)
        totalPauseDuration += finalPauseDuration
      }

      // Calculate actual workout duration (excluding pauses)
      const totalElapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
      const actualWorkoutSeconds = totalElapsedSeconds - totalPauseDuration
      const actualWorkoutMinutes = Math.round(actualWorkoutSeconds / 60)

      updateData.status = 'completed'
      updateData.finished_at = now.toISOString()
      updateData.actual_duration_minutes = actualWorkoutMinutes
      updateData.total_pause_duration_seconds = totalPauseDuration
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be pause, resume, or finish' },
        { status: 400 }
      )
    }

    // Update session
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating session:', error)
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
    }

    return NextResponse.json({ success: true, session: data })
  } catch (error) {
    console.error('Error in workout session PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
