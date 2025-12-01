import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/user/restart-cycle
 * Restarts user's program cycle (starts new 30-day cycle with same program)
 * Called when user completes Day 30 and has remaining capsules
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Check for valid Supabase session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 })
    }

    // 2. Get email from session (trusted source)
    const sessionEmail = session.user.email

    if (!sessionEmail) {
      return NextResponse.json({ error: 'Unauthorized - No email in session' }, { status: 401 })
    }

    // 3. Get request body
    const body = await request.json()
    const { email: requestEmail } = body

    // 4. Validate email matches session
    if (requestEmail !== sessionEmail) {
      console.warn(`⚠️ Email mismatch: request=${requestEmail}, session=${sessionEmail}`)
      return NextResponse.json({ error: 'Unauthorized - Email mismatch' }, { status: 401 })
    }

    // 5. Update program_start_date to today (restart cycle)
    const today = new Date().toISOString() // Full timestamp

    // Update quiz_results_v2 instead of users table
    const { error: updateError } = await (supabase
      .from('quiz_results_v2') as any)
      .update({
        program_start_date: today,
      })
      .eq('email', sessionEmail)

    if (updateError) {
      console.error('Error updating program_start_date:', updateError)
      return NextResponse.json(
        { error: 'Failed to restart cycle', details: updateError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Cycle restarted for ${sessionEmail} - new start date: ${today}`)

    return NextResponse.json({
      success: true,
      message: 'Cycle restarted successfully',
      new_start_date: today,
    })
  } catch (error) {
    console.error('Error in restart-cycle API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
