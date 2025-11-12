import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/workout/substitute-exercise
 * Substitute an exercise with an alternative
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, date, dayOfWeek, exerciseOrder, originalExerciseName, substitutedExercise, reason } = body

    if (!email || !date || !dayOfWeek || !exerciseOrder || !originalExerciseName || !substitutedExercise) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Upsert the substitution
    const { data, error } = await supabase
      .from('user_exercise_substitutions')
      .upsert({
        email,
        date,
        day_of_week: dayOfWeek,
        exercise_order: exerciseOrder,
        original_exercise_name: originalExerciseName,
        substituted_exercise: substitutedExercise,
        reason: reason || null,
      }, {
        onConflict: 'email,date,exercise_order'
      })
      .select()
      .single()

    if (error) {
      console.error('Error substituting exercise:', error)
      return NextResponse.json({ error: 'Failed to substitute exercise' }, { status: 500 })
    }

    return NextResponse.json({ success: true, substitution: data })
  } catch (error) {
    console.error('Error in substitute exercise POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/workout/substitute-exercise
 * Undo exercise substitution (revert to original)
 * Query params: email, date, exerciseOrder
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')
    const exerciseOrder = searchParams.get('exerciseOrder')

    if (!email || !date || !exerciseOrder) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('user_exercise_substitutions')
      .delete()
      .eq('email', email)
      .eq('date', date)
      .eq('exercise_order', parseInt(exerciseOrder))

    if (error) {
      console.error('Error deleting substitution:', error)
      return NextResponse.json({ error: 'Failed to delete substitution' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in substitute exercise DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/workout/substitute-exercise
 * Get exercise substitutions for a date
 * Query params: email, date
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

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_exercise_substitutions')
      .select('*')
      .eq('email', email)
      .eq('date', date)

    if (error) {
      console.error('Error fetching substitutions:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ substitutions: data || [] })
  } catch (error) {
    console.error('Error in substitute exercise GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
