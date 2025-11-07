import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/quiz/start
 * Initialize a new quiz session
 *
 * Body: { category: 'libido' | 'energy' | 'muscle', email: string }
 * Returns: { session_id: string, success: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, email } = body

    // Validate input
    if (!category || !['libido', 'energy', 'muscle'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: libido, energy, or muscle' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create quiz session
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([
        {
          category,
          email,
          started_at: new Date().toISOString(),
          status: 'in_progress',
        },
      ])
      .select('id')
      .single()

    if (error) {
      console.error('Error creating quiz session:', error)
      return NextResponse.json(
        { error: 'Failed to create quiz session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session_id: data.id,
    })
  } catch (error) {
    console.error('Unexpected error in /api/quiz/start:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
