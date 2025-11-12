/**
 * API Route: /api/workout/progress
 * Fetches workout progress data for a specific exercise over time
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
    const exerciseName = searchParams.get('exerciseName')
    const days = parseInt(searchParams.get('days') || '90') // Default to 90 days

    if (!email || !exerciseName) {
      return NextResponse.json(
        { error: 'Email and exercise name are required' },
        { status: 400 }
      )
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch all sets for this exercise within the date range
    const { data, error } = await supabase
      .from('workout_exercise_sets')
      .select('date, set_number, weight_kg, actual_reps, rpe')
      .eq('email', email)
      .eq('exercise_name', exerciseName)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('set_number', { ascending: true })

    if (error) {
      console.error('Error fetching progress data:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group by date and calculate metrics
    const progressByDate: {
      [date: string]: {
        date: string
        maxWeight: number
        totalVolume: number
        avgRpe: number
        totalReps: number
        sets: number
      }
    } = {}

    data.forEach((set) => {
      const date = set.date
      if (!progressByDate[date]) {
        progressByDate[date] = {
          date,
          maxWeight: 0,
          totalVolume: 0,
          avgRpe: 0,
          totalReps: 0,
          sets: 0,
        }
      }

      const weight = set.weight_kg || 0
      const reps = set.actual_reps || 0
      const rpe = set.rpe || 0

      progressByDate[date].maxWeight = Math.max(progressByDate[date].maxWeight, weight)
      progressByDate[date].totalVolume += weight * reps
      progressByDate[date].totalReps += reps
      progressByDate[date].avgRpe = (progressByDate[date].avgRpe * progressByDate[date].sets + rpe) / (progressByDate[date].sets + 1)
      progressByDate[date].sets += 1
    })

    // Convert to array and format
    const progressData = Object.values(progressByDate).map((day) => ({
      date: day.date,
      maxWeight: Math.round(day.maxWeight * 10) / 10,
      totalVolume: Math.round(day.totalVolume),
      avgRpe: Math.round(day.avgRpe * 10) / 10,
      totalReps: day.totalReps,
      sets: day.sets,
    }))

    return NextResponse.json({
      exerciseName,
      days,
      progressData,
      totalWorkouts: progressData.length,
    })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
