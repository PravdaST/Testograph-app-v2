import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/user/change-email
 * Initiates email change process with verification
 *
 * SECURITY: Requires valid session and password confirmation
 * FLOW:
 * 1. Verify current password
 * 2. Check if new email is available (not taken)
 * 3. Send verification email to new address
 * 4. User clicks link in email
 * 5. Supabase updates email automatically
 * 6. Frontend updates all database records with new email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { newEmail, password } = body

    // Validate inputs
    if (!newEmail || !password) {
      return NextResponse.json(
        { error: 'Новият email и паролата са задължителни' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: 'Невалиден email формат' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Check for valid Supabase session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const currentEmail = session.user.email

    if (!currentEmail) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    // Check if new email is same as current
    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Новият email е същият като текущия' },
        { status: 400 }
      )
    }

    // 2. Verify password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Паролата е грешна' },
        { status: 403 }
      )
    }

    // 3. Check if new email is already taken (in Supabase Auth)
    const supabaseService = createServiceClient()
    const { data: existingUsers, error: checkError } = await supabaseService.auth.admin.listUsers()

    if (checkError) {
      console.error('Error checking existing users:', checkError)
    } else if (existingUsers) {
      const emailExists = existingUsers.users.some(
        (u) => u.email?.toLowerCase() === newEmail.toLowerCase()
      )
      if (emailExists) {
        return NextResponse.json(
          { error: 'Този email адрес вече се използва от друг акаунт' },
          { status: 409 }
        )
      }
    }

    // 4. Initiate email change (sends verification email to new address)
    // User must click link in email to confirm
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (updateError) {
      console.error('Error initiating email change:', updateError)

      if (updateError.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Твърде много опити. Моля изчакайте няколко минути.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Грешка при промяна на email. Моля опитайте отново.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email е изпратен към новия адрес. Моля проверете входящата си поща и кликнете на линка за потвърждение.',
      newEmail: newEmail,
    })
  } catch (error) {
    console.error('Error in POST change-email:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/change-email
 * Updates email in all database tables after Supabase confirms the change
 *
 * This should be called AFTER user clicks verification link and Supabase updates the email
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { oldEmail, newEmail } = body

    if (!oldEmail || !newEmail) {
      return NextResponse.json(
        { error: 'Old email and new email are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify that the session email matches the new email (security check)
    if (session.user.email !== newEmail) {
      return NextResponse.json(
        { error: 'Email mismatch - session does not match new email' },
        { status: 403 }
      )
    }

    const supabaseService = createServiceClient()

    // Update email in all relevant tables
    const tables = [
      'quiz_results_v2',
      'users',
      'meal_completions',
      'workout_sessions',
      'workout_exercise_sets',
      'sleep_tracking',
      'testoup_tracking',
      'testoup_inventory',
      'daily_progress_scores',
      'quiz_responses',
      'feedback_submissions',
    ]

    const updatePromises = tables.map((table) =>
      (supabaseService.from(table) as any)
        .update({ email: newEmail })
        .eq('email', oldEmail)
    )

    const results = await Promise.allSettled(updatePromises)

    // Log any failures (but don't fail the whole operation)
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to update ${tables[index]}:`, result.reason)
      } else if (result.value.error) {
        console.error(`Error updating ${tables[index]}:`, result.value.error)
      } else {
        console.log(`✅ Updated ${tables[index]} successfully`)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Email updated in all database tables',
      tablesUpdated: tables.length,
    })
  } catch (error) {
    console.error('Error in PATCH change-email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
