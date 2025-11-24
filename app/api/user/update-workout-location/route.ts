import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

type WorkoutLocation = 'home' | 'gym'

const VALID_LOCATIONS: WorkoutLocation[] = ['home', 'gym']

/**
 * POST /api/user/update-workout-location
 * Updates user's workout location preference (home/gym)
 *
 * SECURITY: Requires valid session, users can only update their own location
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: bodyEmail, workout_location } = body

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(bodyEmail)
    if (authError) return authError

    // Validate workout_location
    if (!workout_location) {
      return NextResponse.json(
        { error: 'workout_location е задължително' },
        { status: 400 }
      )
    }

    if (!VALID_LOCATIONS.includes(workout_location)) {
      return NextResponse.json(
        { error: 'Невалидна локация. Трябва да е "home" или "gym"' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Update workout location in quiz_results_v2 table (latest record)
    const { error: updateError } = await (supabase
      .from('quiz_results_v2') as any)
      .update({ workout_location })
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    if (updateError) {
      console.error('Error updating workout location:', updateError)
      return NextResponse.json(
        { error: 'Грешка при промяна на локацията' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      workout_location,
      message: 'Локацията е променена успешно',
    })
  } catch (error) {
    console.error('Error in POST update-workout-location:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
