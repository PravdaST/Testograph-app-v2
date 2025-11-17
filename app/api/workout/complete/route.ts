import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/workout/complete
 * Save workout completion to database with automatic locking until midnight
 *
 * Expects: { email, day_of_week, workout_name, target_duration_minutes, completed_sets }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, day_of_week, workout_name, target_duration_minutes, completed_sets } = body

    if (!email || !day_of_week || !workout_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get today's date in Bulgarian timezone (Europe/Sofia)
    const today = new Date().toLocaleString('en-CA', {
      timeZone: 'Europe/Sofia',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split(',')[0]

    // Check if workout already completed today
    const { data: existing } = await (supabase
      .from('workout_sessions') as any)
      .select('*')
      .eq('email', email)
      .eq('date', today)
      .eq('day_of_week', day_of_week)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Workout already completed for today' },
        { status: 400 }
      )
    }

    // Calculate total sets completed
    const totalSetsCompleted = Object.values(completed_sets as Record<string, number[]>).reduce(
      (sum, sets) => sum + sets.length,
      0
    )

    // Insert workout session
    const { data: session, error } = await (supabase
      .from('workout_sessions') as any)
      .insert({
        email,
        date: today,
        day_of_week,
        workout_name,
        target_duration_minutes,
        actual_duration_minutes: target_duration_minutes, // For now, use target
        started_at: new Date().toISOString(),
        finished_at: new Date().toISOString(),
        completed_sets: completed_sets,
        total_sets_completed: totalSetsCompleted,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving workout:', error)
      return NextResponse.json(
        { error: 'Failed to save workout completion' },
        { status: 500 }
      )
    }

    // Calculate locked_until (midnight Bulgarian time)
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)

    return NextResponse.json({
      success: true,
      session,
      locked_until: midnight.toISOString(),
    })
  } catch (error) {
    console.error('Error in workout complete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
