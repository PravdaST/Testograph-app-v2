import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { QuizResult } from '@/lib/data/quiz/types'
import { sendWelcomeEmail } from '@/lib/email/welcome'
import crypto from 'crypto'

/**
 * POST /api/quiz/complete
 * Save completed quiz results
 *
 * Body: {
 *   session_id?: string (optional),
 *   email: string,
 *   result: QuizResult
 * }
 * Returns: { success: boolean, result_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, email, result } = body as {
      session_id?: string
      email: string
      result: QuizResult
    }

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (!result || !result.category || result.total_score === undefined) {
      return NextResponse.json(
        { error: 'Invalid quiz result data' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Extract workout location from responses
    const workoutLocationResponse = result.responses.find((r) =>
      r.question_id.includes('workout_location')
    )

    let workout_location: 'home' | 'gym' | null = null
    if (workoutLocationResponse) {
      const answer = workoutLocationResponse.answer.toString()
      // Extract from note field: "workout_location:home" or "workout_location:gym"
      if (answer.includes('home') || answer === 'location_home') {
        workout_location = 'home'
      } else if (answer.includes('gym') || answer === 'location_gym') {
        workout_location = 'gym'
      }
    }

    // Save quiz result
    const { data: quizResultData, error: resultError } = await supabase
      .from('quiz_results_v2')
      .insert([
        {
          session_id: session_id || null,
          email,
          category: result.category,
          total_score: result.total_score,
          determined_level: result.determined_level,
          workout_location,
          breakdown_symptoms: result.breakdown.symptoms,
          breakdown_nutrition: result.breakdown.nutrition,
          breakdown_training: result.breakdown.training,
          breakdown_sleep_recovery: result.breakdown.sleep_recovery,
          breakdown_context: result.breakdown.context,
          breakdown_overall: result.breakdown.overall,
          completed_at: result.completed_at,
        },
      ])
      .select('id')
      .single()

    if (resultError) {
      console.error('Error saving quiz result:', resultError)
      return NextResponse.json(
        { error: 'Failed to save quiz result' },
        { status: 500 }
      )
    }

    const result_id = quizResultData.id

    // Extract user name from responses for quiz_results table
    const nameResponse = result.responses.find((r) => r.question_id.includes('name'))
    const firstName = nameResponse && typeof nameResponse.answer === 'string' ? nameResponse.answer : 'User'

    // Check if user already has capsules from previous purchase
    const { data: existingInventory } = await supabase
      .from('testoup_inventory')
      .select('capsules_remaining')
      .eq('email', email)
      .maybeSingle()

    // Prepare access data if user has capsules
    let initialAccessData: Record<string, unknown> = {}
    if (existingInventory && existingInventory.capsules_remaining > 0) {
      const capsules = existingInventory.capsules_remaining
      const daysAccess = capsules / 2 // 2 capsules per day
      const accessType = capsules >= 60 ? 'full' : 'sample'
      const accessEndDate = new Date(Date.now() + daysAccess * 24 * 60 * 60 * 1000)

      initialAccessData = {
        has_active_access: true,
        access_type: accessType,
        access_start_date: new Date().toISOString(),
        access_end_date: accessEndDate.toISOString(),
      }

      console.log(`🎁 User purchased before quiz! Granting access immediately:`)
      console.log(`   Capsules: ${capsules}`)
      console.log(`   Days: ${daysAccess}`)
      console.log(`   Type: ${accessType}`)
    }

    // Create record in quiz_results table WITH access data if applicable
    const { error: quizResultsError } = await supabase
      .from('quiz_results')
      .insert({
        email,
        first_name: firstName,
        ...initialAccessData,
      })
      .select()
      .single()

    if (quizResultsError && quizResultsError.code !== '23505') {
      // Ignore duplicate key errors (user already exists)
      console.error('Error creating quiz_results record:', quizResultsError)
    } else if (Object.keys(initialAccessData).length > 0) {
      console.log('✅ Access granted on quiz completion!')
    }

    // Save individual responses
    if (result.responses && result.responses.length > 0) {
      const responsesToInsert = result.responses.map((response) => ({
        result_id,
        question_id: response.question_id,
        answer: typeof response.answer === 'string' ? response.answer : response.answer.toString(),
        points: response.points,
      }))

      const { error: responsesError } = await supabase
        .from('quiz_responses')
        .insert(responsesToInsert)

      if (responsesError) {
        console.error('Error saving quiz responses:', responsesError)
        // Don't fail the request if responses fail, result is already saved
      }
    }

    // Update session status if session_id provided
    if (session_id) {
      await supabase
        .from('quiz_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', session_id)
    }

    // Generate credentials and create user account
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase credentials not configured')
        throw new Error('Supabase credentials not configured')
      }

      const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Check if user already exists
      const { data: existingUserData } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUserData?.users.find((u) => u.email === email)

      let generatedPassword: string | null = null
      let isNewUser = false

      if (!existingUser) {
        // User doesn't exist - create new account
        generatedPassword = crypto.randomBytes(12).toString('base64')

        // Extract user name from responses
        const nameResponse = result.responses.find((r) => r.question_id.includes('name'))
        const userName = nameResponse && typeof nameResponse.answer === 'string' ? nameResponse.answer : undefined

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: {
            full_name: userName || '',
            quiz_category: result.category,
            quiz_score: result.total_score,
            quiz_level: result.determined_level,
            workout_location: workout_location || 'gym', // Default to gym if not provided
          },
        })

        if (createError) {
          console.error('Error creating user:', createError)
        } else {
          isNewUser = true
          console.log('User created successfully:', newUser.user.id)
          console.log('📧 Email:', email)
          console.log('🔑 Password:', generatedPassword)

          // Send welcome email with credentials
          const emailSent = await sendWelcomeEmail({
            email,
            password: generatedPassword,
            userName,
            category: result.category,
          })

          if (!emailSent) {
            console.error('Failed to send welcome email, but user was created')
          }
        }
      } else {
        console.log('User already exists, skipping credential generation')
      }

      return NextResponse.json({
        success: true,
        result_id,
        user_created: isNewUser,
      })
    } catch (credentialError) {
      console.error('Error generating credentials:', credentialError)
      // Don't fail the request if credential generation fails
      // Quiz result is already saved
      return NextResponse.json({
        success: true,
        result_id,
        user_created: false,
        warning: 'Quiz saved but credential generation failed',
      })
    }
  } catch (error) {
    console.error('Unexpected error in /api/quiz/complete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
