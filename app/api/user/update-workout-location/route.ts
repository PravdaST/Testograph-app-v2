import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/user/update-workout-location
 * Updates user's workout location preference (home/gym)
 */
export async function POST(request: NextRequest) {
  try {
    const { email, workout_location } = await request.json()

    if (!email || !workout_location) {
      return NextResponse.json(
        { error: 'Email and workout_location are required' },
        { status: 400 }
      )
    }

    if (!['home', 'gym'].includes(workout_location)) {
      return NextResponse.json(
        { error: 'Invalid workout_location. Must be "home" or "gym"' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { data, error } = await (supabase
      .from('user_programs') as any)
      .update({
        workout_location,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      console.error('Error updating workout location:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating workout location:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
