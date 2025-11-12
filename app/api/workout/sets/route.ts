import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/workout/sets
 * Log a completed exercise set
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      workoutSessionId,
      date,
      exerciseName,
      exerciseOrder,
      setNumber,
      targetReps,
      actualReps,
      weightKg,
      rpe,
      notes,
    } = body

    if (!email || !date || !exerciseName || !exerciseOrder || !setNumber || !targetReps || actualReps === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert the set log
    const { data, error } = await supabase
      .from('workout_exercise_sets')
      .insert({
        email,
        workout_session_id: workoutSessionId || null,
        date,
        exercise_name: exerciseName,
        exercise_order: exerciseOrder,
        set_number: setNumber,
        target_reps: targetReps,
        actual_reps: actualReps,
        weight_kg: weightKg || null,
        rpe: rpe || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error logging set:', error)
      return NextResponse.json({ error: 'Failed to log set' }, { status: 500 })
    }

    return NextResponse.json({ success: true, set: data })
  } catch (error) {
    console.error('Error in workout sets POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/workout/sets
 * Get exercise sets for a specific workout or date
 * Query params: email, date, workoutSessionId (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')
    const workoutSessionId = searchParams.get('workoutSessionId')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    let query = supabase
      .from('workout_exercise_sets')
      .select('*')
      .eq('email', email)

    if (workoutSessionId) {
      query = query.eq('workout_session_id', workoutSessionId)
    } else if (date) {
      query = query.eq('date', date)
    } else {
      return NextResponse.json(
        { error: 'Either date or workoutSessionId is required' },
        { status: 400 }
      )
    }

    const { data, error } = await query.order('exercise_order').order('set_number')

    if (error) {
      console.error('Error fetching sets:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ sets: data || [] })
  } catch (error) {
    console.error('Error in workout sets GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/workout/sets
 * Delete a specific set (for undo functionality)
 * Query params: setId
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const setId = searchParams.get('setId')

    if (!setId) {
      return NextResponse.json(
        { error: 'Set ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('workout_exercise_sets')
      .delete()
      .eq('id', setId)

    if (error) {
      console.error('Error deleting set:', error)
      return NextResponse.json({ error: 'Failed to delete set' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in workout sets DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
