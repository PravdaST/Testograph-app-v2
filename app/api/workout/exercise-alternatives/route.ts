import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/workout/exercise-alternatives
 * Get alternative exercises for a given exercise
 * Query params: exerciseName
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseName = searchParams.get('exerciseName')

    if (!exerciseName) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await (supabase
      .from('exercise_alternatives') as any)
      .select('*')
      .eq('original_exercise_name', exerciseName)
      .order('difficulty_level')

    if (error) {
      console.error('Error fetching alternatives:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ alternatives: data || [] })
  } catch (error) {
    console.error('Error in exercise alternatives GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
