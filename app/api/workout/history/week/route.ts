import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/workout/history/week?email={email}
 * Get completed workouts for the current week
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get start of current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // If Sunday, go back 6 days
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    // Get end of current week (Sunday)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // Format dates for database query
    const startDate = weekStart.toISOString().split('T')[0]
    const endDate = weekEnd.toISOString().split('T')[0]

    // Fetch completed workouts for this week
    const { data: workouts, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('email', email)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching workout history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch workout history' },
        { status: 500 }
      )
    }

    // Create a map of completed workouts by day_of_week
    const completedByDayOfWeek: Record<number, boolean> = {}
    workouts?.forEach((workout) => {
      completedByDayOfWeek[workout.day_of_week] = true
    })

    return NextResponse.json({
      completedByDayOfWeek,
      workouts: workouts || [],
    })
  } catch (error) {
    console.error('Error in workout history week:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
