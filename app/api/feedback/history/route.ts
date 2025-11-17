import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/feedback/history?email=user@example.com
 * Get all feedback submissions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get all submissions for this user
    const { data: submissions, error: submissionsError } = await (supabase
      .from('feedback_submissions') as any)
      .select(`
        id,
        program_day,
        submitted_at,
        feedback_responses (
          question_id,
          answer
        )
      `)
      .eq('email', email)
      .order('program_day', { ascending: true })

    if (submissionsError) {
      console.error('Error fetching feedback history:', submissionsError)
      return NextResponse.json(
        { error: 'Failed to fetch feedback history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      submissions: submissions || [],
    })
  } catch (error) {
    console.error('Unexpected error in /api/feedback/history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
