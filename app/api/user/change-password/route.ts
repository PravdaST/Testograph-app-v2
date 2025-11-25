import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/user/change-password
 * Change user password with current password verification
 *
 * SECURITY: Requires valid session and current password verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Текущата и новата парола са задължителни' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Новата парола трябва да е поне 8 символа' },
        { status: 400 }
      )
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'Новата парола трябва да е различна от текущата' },
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

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    // 2. Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Текущата парола е грешна' },
        { status: 403 }
      )
    }

    // 3. Update password using Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Грешка при промяна на паролата. Моля опитайте отново.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Паролата е променена успешно',
    })
  } catch (error) {
    console.error('Error in POST change-password:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
