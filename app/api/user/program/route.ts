import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/program
 * Get user's program based on their latest quiz result
 *
 * Expects: email in query params or cookies
 * Returns: { category, level, program_data }
 */
export async function GET(request: NextRequest) {
  try {
    // Get email from query params or session storage
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get latest quiz result for this email
    const { data: quizResult, error } = await supabase
      .from('quiz_results_v2')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !quizResult) {
      return NextResponse.json(
        { error: 'No quiz result found for this email' },
        { status: 404 }
      )
    }

    // Return program data
    return NextResponse.json({
      email: quizResult.email,
      first_name: quizResult.first_name,
      category: quizResult.category,
      level: quizResult.determined_level,
      total_score: quizResult.total_score,
      workout_location: quizResult.workout_location || 'gym', // Default to gym if not set
      breakdown: {
        symptoms: quizResult.breakdown_symptoms,
        nutrition: quizResult.breakdown_nutrition,
        training: quizResult.breakdown_training,
        sleep_recovery: quizResult.breakdown_sleep_recovery,
        context: quizResult.breakdown_context,
      },
      completed_at: quizResult.completed_at,
      program_start_date: quizResult.created_at, // When the user started the program
      profile_picture_url: quizResult.profile_picture_url,
      goal: quizResult.goal,
      program_end_date: quizResult.program_end_date,
    })
  } catch (error) {
    console.error('Error fetching user program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
