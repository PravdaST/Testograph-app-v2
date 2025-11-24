import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * GET /api/workout/check?email={email}&date={date}
 * Check if workout is completed for specific date
 *
 * SECURITY: Requires valid session, users can only check their own workouts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')
    const date = searchParams.get('date')

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(queryEmail)
    if (authError) return authError

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if there's a completed workout for this date
    const { data, error } = await (supabase
      .from('workout_sessions') as any)
      .select('id, day_of_week, workout_name, finished_at')
      .eq('email', email)
      .gte('started_at', `${date}T00:00:00`)
      .lte('started_at', `${date}T23:59:59`)
      .not('finished_at', 'is', null)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking workout:', error)
      return NextResponse.json(
        { error: 'Failed to check workout' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      completed: !!data,
      workout: data || null,
    })
  } catch (error) {
    console.error('Error in workout check GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
