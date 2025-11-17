import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { FeedbackResponse } from '@/lib/data/feedback-questions'

/**
 * POST /api/feedback/submit
 * Submit user feedback for a specific program day
 *
 * Body: {
 *   email: string,
 *   program_day: 7 | 14 | 21 | 28 | 30,
 *   responses: FeedbackResponse[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, program_day, responses } = body as {
      email: string
      program_day: 7 | 14 | 21 | 28 | 30
      responses: FeedbackResponse[]
    }

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (![7, 14, 21, 28, 30].includes(program_day)) {
      return NextResponse.json(
        { error: 'Invalid program day' },
        { status: 400 }
      )
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'Responses are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if feedback already exists for this day
    const { data: existingSubmission } = await supabase
      .from('feedback_submissions')
      .select('id')
      .eq('email', email)
      .eq('program_day', program_day)
      .single()

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this day' },
        { status: 409 }
      )
    }

    // Create feedback submission
    const { data: submission, error: submissionError } = await (supabase
      .from('feedback_submissions') as any)
      .insert({
        email,
        program_day,
      })
      .select('id')
      .single()

    if (submissionError) {
      console.error('Error creating feedback submission:', submissionError)
      return NextResponse.json(
        { error: 'Failed to create feedback submission' },
        { status: 500 }
      )
    }

    // Insert all responses
    const responsesToInsert = responses.map((response) => ({
      submission_id: submission.id,
      question_id: response.question_id,
      answer: typeof response.answer === 'string'
        ? response.answer
        : response.answer.toString(),
    }))

    const { error: responsesError } = await (supabase
      .from('feedback_responses') as any)
      .insert(responsesToInsert)

    if (responsesError) {
      console.error('Error saving feedback responses:', responsesError)
      return NextResponse.json(
        { error: 'Failed to save feedback responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      submission_id: submission.id,
    })
  } catch (error) {
    console.error('Unexpected error in /api/feedback/submit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
