import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * POST /api/user/update-goal
 * Update user's goal for the 30-day program
 *
 * SECURITY: Requires valid session, users can only update their own goal
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: bodyEmail, goal } = body

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(bodyEmail)
    if (authError) return authError

    // Validate goal
    if (!goal || !goal.trim()) {
      return NextResponse.json(
        { error: 'Целта е задължителна' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Update the goal for the user's latest quiz result
    const { error: updateError } = await (supabase
      .from('quiz_results_v2') as any)
      .update({ goal: goal.trim() })
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    if (updateError) {
      console.error('Error updating goal:', updateError)
      return NextResponse.json(
        { error: 'Грешка при промяна на целта' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      goal: goal.trim(),
      message: 'Целта е променена успешно',
    })
  } catch (error) {
    console.error('Error in POST update-goal:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
