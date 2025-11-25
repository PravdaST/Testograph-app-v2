import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/user/sessions
 * Get current session information
 *
 * Note: Supabase Auth API doesn't provide list of all sessions
 * This endpoint returns info about the current session only
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    // Extract session info
    const sessionInfo = {
      userId: session.user.id,
      email: session.user.email,
      createdAt: session.user.created_at,
      lastSignInAt: session.user.last_sign_in_at,
      expiresAt: session.expires_at,
      // Parse user agent for device/browser info (basic)
      userAgent: request.headers.get('user-agent') || 'Unknown',
    }

    return NextResponse.json({
      success: true,
      currentSession: sessionInfo,
      note: 'Only current session available. Use DELETE to sign out from all devices.',
    })
  } catch (error) {
    console.error('Error in GET sessions:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/sessions
 * Sign out from all devices
 *
 * This will invalidate all refresh tokens for the user
 * forcing all devices to re-authenticate
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    // Sign out (scope: global will invalidate all sessions)
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'global',
    })

    if (signOutError) {
      console.error('Error signing out from all devices:', signOutError)
      return NextResponse.json(
        { error: 'Грешка при излизане от всички устройства' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Успешно излязохте от всички устройства',
    })
  } catch (error) {
    console.error('Error in DELETE sessions:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
