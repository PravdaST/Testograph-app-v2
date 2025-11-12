import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/workout/exercise-history
 * Get previous workout data for a specific exercise
 * Shows what weight/reps the user did last time
 * Query params: email, exerciseName, limit (optional, default 1)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const exerciseName = searchParams.get('exerciseName')
    const limit = parseInt(searchParams.get('limit') || '1', 10)

    if (!email || !exerciseName) {
      return NextResponse.json(
        { error: 'Email and exercise name are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the most recent sets for this exercise (excluding today)
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('workout_exercise_sets')
      .select('*')
      .eq('email', email)
      .eq('exercise_name', exerciseName)
      .lt('date', today) // Only get previous workouts, not today
      .order('date', { ascending: false })
      .order('set_number', { ascending: true })
      .limit(limit * 10) // Get enough sets for N previous workouts

    if (error) {
      console.error('Error fetching exercise history:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        history: [],
        lastWorkout: null
      })
    }

    // Group sets by date (workout session)
    const workoutsByDate = data.reduce((acc, set) => {
      if (!acc[set.date]) {
        acc[set.date] = []
      }
      acc[set.date].push(set)
      return acc
    }, {} as Record<string, typeof data>)

    // Get the most recent workout
    const dates = Object.keys(workoutsByDate).sort().reverse()
    const lastWorkoutDate = dates[0]
    const lastWorkoutSets = workoutsByDate[lastWorkoutDate]

    return NextResponse.json({
      history: dates.slice(0, limit).map(date => ({
        date,
        sets: workoutsByDate[date]
      })),
      lastWorkout: {
        date: lastWorkoutDate,
        sets: lastWorkoutSets
      }
    })
  } catch (error) {
    console.error('Error in exercise history GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
