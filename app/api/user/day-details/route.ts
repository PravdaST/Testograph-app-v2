import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/day-details?email={email}&date={date}
 * Get detailed task completion status for a specific day
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')

    if (!email || !date) {
      return NextResponse.json(
        { error: 'Email and date are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // 1. Check meals
    const { data: meals } = await (supabase
      .from('meal_completions') as any)
      .select('meal_number')
      .eq('email', email)
      .eq('date', date)
      .order('meal_number')

    const mealsCompleted = meals?.length || 0
    const mealsTotal = 5
    const mealsStatus = mealsCompleted >= 3 ? 'completed' : 'incomplete'

    // 2. Check workout
    const { data: workout } = await (supabase
      .from('workout_sessions') as any)
      .select('id, workout_name, finished_at, actual_duration_minutes')
      .eq('email', email)
      .eq('date', date)
      .not('finished_at', 'is', null)
      .maybeSingle()

    const workoutStatus = workout ? 'completed' : 'incomplete'

    // 3. Check sleep
    const { data: sleep } = await (supabase
      .from('sleep_tracking') as any)
      .select('hours_slept, quality_rating, feeling')
      .eq('email', email)
      .eq('date', date)
      .maybeSingle()

    const sleepStatus = sleep ? 'completed' : 'incomplete'

    // 4. Check TestoUp
    const { data: testoup } = await (supabase
      .from('testoup_tracking') as any)
      .select('morning_taken, evening_taken')
      .eq('email', email)
      .eq('date', date)
      .maybeSingle()

    const testoUpStatus = (testoup?.morning_taken && testoup?.evening_taken) ? 'completed' : 'incomplete'

    // Calculate overall completion
    const completedTasks = [
      mealsStatus === 'completed',
      workoutStatus === 'completed',
      sleepStatus === 'completed',
      testoUpStatus === 'completed'
    ].filter(Boolean).length

    return NextResponse.json({
      date,
      completedTasks,
      totalTasks: 4,
      tasks: {
        meals: {
          status: mealsStatus,
          completed: mealsCompleted,
          total: mealsTotal,
          completedMealNumbers: meals?.map((m: any) => m.meal_number) || []
        },
        workout: {
          status: workoutStatus,
          name: workout?.workout_name || null,
          duration: workout?.actual_duration_minutes || null,
          finishedAt: workout?.finished_at || null
        },
        sleep: {
          status: sleepStatus,
          hours: sleep?.hours_slept || null,
          quality: sleep?.quality_rating || null,
          feeling: sleep?.feeling || null
        },
        testoup: {
          status: testoUpStatus,
          morning: testoup?.morning_taken || false,
          evening: testoup?.evening_taken || false
        }
      }
    })
  } catch (error) {
    console.error('Error in day-details GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
