import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSession } from '@/lib/auth/validate-session'

/**
 * DELETE /api/user/delete-account
 * Permanently deletes user account and all associated data
 *
 * SECURITY: Requires valid session and only allows deleting own account
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Validate session - user must be authenticated
    const { isValid, email, error } = await validateSession()
    if (!isValid || !email) {
      return error || NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Optional: Check if query param email matches session (for logging)
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')
    if (queryEmail && queryEmail !== email) {
      console.warn(`⚠️ Delete account attempt for different email: query=${queryEmail}, session=${email}`)
      return NextResponse.json(
        { error: 'Unauthorized - Cannot delete other user accounts' },
        { status: 403 }
      )
    }

    // Use session email (trusted source) for all operations
    const supabase = createServiceClient()

    // Delete all user data from all tables
    // Order matters - delete child records first to avoid foreign key constraints

    // 1. Delete meal completions
    await (supabase
      .from('meal_completions') as any)
      .delete()
      .eq('email', email)

    // 2. Delete sleep tracking
    await (supabase
      .from('sleep_tracking') as any)
      .delete()
      .eq('email', email)

    // 3. Delete TestoUp tracking
    await (supabase
      .from('testoup_tracking') as any)
      .delete()
      .eq('email', email)

    // 4. Delete TestoUp inventory
    await (supabase
      .from('testoup_inventory') as any)
      .delete()
      .eq('email', email)

    // 5. Delete workout sessions
    await (supabase
      .from('workout_sessions') as any)
      .delete()
      .eq('email', email)

    // 6. Delete quiz responses
    await (supabase
      .from('quiz_responses') as any)
      .delete()
      .eq('email', email)

    // 7. Finally, delete user program (parent record)
    const { error: programError } = await (supabase
      .from('user_programs') as any)
      .delete()
      .eq('email', email)

    if (programError) {
      console.error('Error deleting user program:', programError)
      return NextResponse.json(
        { error: programError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
