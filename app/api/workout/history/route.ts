import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface WorkoutSession {
  date: string
  actual_duration_minutes?: number
  day_of_week?: number
  [key: string]: unknown
}

/**
 * GET /api/workout/history
 * Get workout history and statistics for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const limit = searchParams.get('limit')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch all completed workout sessions
    let query = (supabase
      .from('workout_sessions') as any)
      .select('*')
      .eq('email', email)
      .eq('status', 'completed')
      .order('finished_at', { ascending: false })

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error('Error fetching workout history:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      totalWorkouts: sessions.length,
      totalMinutes: sessions.reduce((sum: number, s: any) => sum + (s.actual_duration_minutes || 0), 0),
      averageDuration: sessions.length > 0
        ? Math.round(sessions.reduce((sum: number, s: any) => sum + (s.actual_duration_minutes || 0), 0) / sessions.length)
        : 0,
      currentStreak: calculateCurrentStreak(sessions),
      longestStreak: calculateLongestStreak(sessions),
      workoutsByDay: calculateWorkoutsByDay(sessions),
      recentWorkouts: sessions.slice(0, 10),
    }

    return NextResponse.json({ stats, sessions })
  } catch (error) {
    console.error('Error in workout history GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Calculate current workout streak (consecutive days)
 */
function calculateCurrentStreak(sessions: WorkoutSession[]): number {
  if (sessions.length === 0) return 0

  const sortedDates = [...new Set(sessions.map((s: any) => s.date))].sort().reverse()
  const today = new Date().toISOString().split('T')[0]

  let streak = 0
  let checkDate = new Date(today)

  for (const sessionDate of sortedDates) {
    const dateStr = checkDate.toISOString().split('T')[0]

    if (sessionDate === dateStr) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (sessionDate < dateStr) {
      // Gap found
      const daysBetween = Math.floor((new Date(dateStr).getTime() - new Date(sessionDate).getTime()) / (1000 * 60 * 60 * 24))
      if (daysBetween > 1) {
        break
      }
      checkDate = new Date(sessionDate)
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }

  return streak
}

/**
 * Calculate longest workout streak ever
 */
function calculateLongestStreak(sessions: WorkoutSession[]): number {
  if (sessions.length === 0) return 0

  const sortedDates = [...new Set(sessions.map((s: any) => s.date))].sort()

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

/**
 * Calculate workout distribution by day of week
 */
function calculateWorkoutsByDay(sessions: WorkoutSession[]): Record<number, number> {
  const byDay: Record<number, number> = {
    1: 0, // Monday
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0, // Sunday
  }

  sessions.forEach((session: any) => {
    if (session.day_of_week) {
      byDay[session.day_of_week]++
    }
  })

  return byDay
}
