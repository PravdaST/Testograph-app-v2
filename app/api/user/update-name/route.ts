import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * POST /api/user/update-name
 * Updates user's first name
 *
 * SECURITY: Requires valid session, users can only update their own name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: bodyEmail, first_name } = body

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(bodyEmail)
    if (authError) return authError

    if (!first_name || !first_name.trim()) {
      return NextResponse.json(
        { error: 'Името е задължително' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Update first_name in quiz_results_v2 table (latest record)
    const { error } = await (supabase
      .from('quiz_results_v2') as any)
      .update({ first_name: first_name.trim() })
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error updating first name:', error)
      return NextResponse.json(
        { error: 'Грешка при промяна на името' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      first_name: first_name.trim(),
      message: 'Името е променено успешно',
    })
  } catch (error) {
    console.error('Error in POST update-name:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
