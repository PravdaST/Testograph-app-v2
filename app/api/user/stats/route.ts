import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * GET /api/user/stats
 * Returns aggregated statistics for the user over the last 30 days
 *
 * SECURITY: Requires valid session, users can only access their own stats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')

    // Validate session and get authenticated user's email
    const { email, error } = await validateSessionAndEmail(queryEmail)
    if (error) return error

    const supabase = createServiceClient()

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    // 1. Get meals completed in last 30 days
    const { data: mealData, error: mealError } = await (supabase
      .from('meal_completions') as any)
      .select('*')
      .eq('email', email)
      .gte('date', thirtyDaysAgoStr)

    const mealsCompleted = mealData?.length || 0

    // 2. Get workouts completed in last 30 days
    const { data: workoutData, error: workoutError } = await (supabase
      .from('workout_sessions') as any)
      .select('*')
      .eq('email', email)
      .gte('date', thirtyDaysAgoStr)

    const workoutsCompleted = workoutData?.length || 0

    // 3. Get sleep data for last 30 days and calculate average
    const { data: sleepData, error: sleepError } = await (supabase
      .from('sleep_tracking') as any)
      .select('hours_slept')
      .eq('email', email)
      .gte('date', thirtyDaysAgoStr)

    let averageSleepHours = 0
    if (sleepData && sleepData.length > 0) {
      const totalHours = sleepData.reduce(
        (sum: number, record: any) => sum + (record.hours_slept || 0),
        0
      )
      averageSleepHours = Math.round((totalHours / sleepData.length) * 10) / 10
    }

    // 4. Get TestoUp tracking for last 30 days and calculate compliance
    const { data: testoUpData, error: testoUpError } = await (supabase
      .from('testoup_tracking') as any)
      .select('morning_taken, evening_taken')
      .eq('email', email)
      .gte('date', thirtyDaysAgoStr)

    let testoUpCompliance = 0
    if (testoUpData && testoUpData.length > 0) {
      const totalDoses = testoUpData.reduce((sum: number, record: any) => {
        return sum + (record.morning_taken ? 1 : 0) + (record.evening_taken ? 1 : 0)
      }, 0)
      const possibleDoses = testoUpData.length * 2
      testoUpCompliance = Math.round((totalDoses / possibleDoses) * 100)
    }

    // 5. Get program info to calculate days in program
    const { data: programData } = await (supabase
      .from('user_programs') as any)
      .select('completed_at')
      .eq('email', email)
      .single()

    let daysInProgram = 0
    if (programData?.completed_at) {
      const startDate = new Date(programData.completed_at)
      const today = new Date()
      const diffTime = today.getTime() - startDate.getTime()
      daysInProgram = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      mealsCompleted,
      workoutsCompleted,
      averageSleepHours,
      testoUpCompliance,
      daysInProgram,
      periodDays: 30,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
