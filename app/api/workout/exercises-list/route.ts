/**
 * API Route: /api/workout/exercises-list
 * Lists all exercises a user has tracked with workout counts
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Fetch all exercises for this user
    const { data, error } = await supabase
      .from('workout_exercise_sets')
      .select('exercise_name, date')
      .eq('email', email)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching exercises:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group by exercise and count unique workout dates
    const exerciseMap = new Map<
      string,
      { total_workouts: number; last_workout_date: string; dates: Set<string> }
    >()

    data.forEach((row) => {
      const exerciseName = row.exercise_name
      const date = row.date

      if (!exerciseMap.has(exerciseName)) {
        exerciseMap.set(exerciseName, {
          total_workouts: 0,
          last_workout_date: date,
          dates: new Set(),
        })
      }

      const exercise = exerciseMap.get(exerciseName)!
      exercise.dates.add(date)

      // Update last workout date if this date is more recent
      if (date > exercise.last_workout_date) {
        exercise.last_workout_date = date
      }
    })

    // Convert to array and calculate total workouts
    const exercises = Array.from(exerciseMap.entries()).map(([name, data]) => ({
      exercise_name: name,
      total_workouts: data.dates.size,
      last_workout_date: data.last_workout_date,
    }))

    // Sort by last workout date (most recent first)
    exercises.sort((a, b) =>
      new Date(b.last_workout_date).getTime() - new Date(a.last_workout_date).getTime()
    )

    return NextResponse.json({
      exercises,
      totalExercises: exercises.length,
    })
  } catch (error) {
    console.error('Error in exercises-list API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
