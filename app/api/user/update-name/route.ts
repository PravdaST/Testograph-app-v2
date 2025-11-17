import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/user/update-name
 * Updates user's first name
 */
export async function POST(request: NextRequest) {
  try {
    const { email, first_name } = await request.json()

    if (!email || !first_name) {
      return NextResponse.json(
        { error: 'Email and first_name are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { data, error } = await (supabase
      .from('user_programs') as any)
      .update({
        first_name: first_name.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      console.error('Error updating first name:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating first name:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
