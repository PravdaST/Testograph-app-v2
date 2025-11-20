import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/daily-completion?email={email}&startDate={date}&endDate={date}
 * Get daily completion status for a date range
 * Returns which days have all 4 tasks completed (meals, workout, sleep, testoup)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!email || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Email, startDate, and endDate are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get all dates in range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const dates: string[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0])
    }

    // Check completion for each date
    const completionStatus: Record<string, { completed: number; total: number }> = {}

    for (const date of dates) {
      // Check meals (need at least 3 completed)
      const { data: meals } = await (supabase
        .from('meal_completions') as any)
        .select('meal_number')
        .eq('email', email)
        .eq('date', date)

      const mealsCompleted = (meals?.length || 0) >= 3

      // Check workout
      const { data: workout } = await (supabase
        .from('workout_sessions') as any)
        .select('id')
        .eq('email', email)
        .eq('date', date)
        .not('finished_at', 'is', null)
        .maybeSingle()

      const workoutCompleted = !!workout

      // Check sleep
      const { data: sleep } = await (supabase
        .from('sleep_tracking') as any)
        .select('id')
        .eq('email', email)
        .eq('date', date)
        .maybeSingle()

      const sleepCompleted = !!sleep

      // Check TestoUP (both morning and evening)
      const { data: testoup } = await (supabase
        .from('testoup_tracking') as any)
        .select('morning_taken, evening_taken')
        .eq('email', email)
        .eq('date', date)
        .maybeSingle()

      const testoUpCompleted = !!(testoup?.morning_taken && testoup?.evening_taken)

      // Count completed tasks
      const completedCount = [mealsCompleted, workoutCompleted, sleepCompleted, testoUpCompleted].filter(Boolean).length

      completionStatus[date] = {
        completed: completedCount,
        total: 4
      }
    }

    return NextResponse.json({ completionStatus })
  } catch (error) {
    console.error('Error in daily-completion GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
