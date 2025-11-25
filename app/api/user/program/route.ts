import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/user/program
 * Get user's program based on their latest quiz result
 *
 * SECURITY: Validates Supabase session before returning user data
 * Expects: Authenticated user session
 * Returns: { category, level, program_data }
 */
export async function GET(request: NextRequest) {
  try {
    // Create client to check session
    const supabase = await createClient()

    // 1. Check for valid Supabase session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' },
        { status: 401 }
      )
    }

    // 2. Get email from session (trusted source)
    const sessionEmail = session.user.email

    if (!sessionEmail) {
      return NextResponse.json(
        { error: 'Unauthorized - No email in session' },
        { status: 401 }
      )
    }

    // 3. Optional: Validate query param email matches session (for debugging)
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')

    if (queryEmail && queryEmail !== sessionEmail) {
      console.warn(`⚠️ Email mismatch: query=${queryEmail}, session=${sessionEmail}`)
      // Return session email data, not query email (security)
    }

    // Use session email as the trusted source
    const email = sessionEmail

    const supabaseService = createServiceClient()

    // Get latest quiz result for this email (use service client to bypass RLS)
    const { data: quizResult, error } = await (supabaseService
      .from('quiz_results_v2') as any)
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

    // Get account metadata from Supabase Auth
    const accountCreatedAt = session.user.created_at
    const lastSignInAt = session.user.last_sign_in_at
    const emailConfirmedAt = session.user.email_confirmed_at
    const isEmailVerified = !!emailConfirmedAt

    // Return program data + account metadata
    return NextResponse.json({
      email: quizResult.email,
      first_name: quizResult.first_name,
      category: quizResult.category,
      level: quizResult.determined_level,
      total_score: quizResult.total_score,
      workout_location: quizResult.workout_location || 'gym', // Default to gym if not set
      dietary_preference: quizResult.dietary_preference || 'omnivor', // Default to omnivor if not set
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
      // Account metadata from Supabase Auth
      account_created_at: accountCreatedAt,
      last_sign_in_at: lastSignInAt,
      email_confirmed_at: emailConfirmedAt,
      is_email_verified: isEmailVerified,
    })
  } catch (error) {
    console.error('Error fetching user program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
