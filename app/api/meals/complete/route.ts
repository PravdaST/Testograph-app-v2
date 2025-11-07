import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/meals/complete
 * Get completed meals for a specific date
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
      .from('meal_completions')
      .select('meal_number')
      .eq('email', email)
      .eq('date', date)

    if (error) {
      console.error('Error fetching meal completions:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Return array of completed meal numbers
    const completedMeals = data.map((item) => item.meal_number)
    return NextResponse.json({ completedMeals })
  } catch (error) {
    console.error('Error in meals/complete GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/meals/complete
 * Toggle meal completion (mark or unmark)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, date, mealNumber } = body

    if (!email || !date || mealNumber === undefined) {
      return NextResponse.json(
        { error: 'Email, date, and mealNumber are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if meal is already completed
    const { data: existing } = await supabase
      .from('meal_completions')
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .eq('meal_number', mealNumber)
      .maybeSingle()

    if (existing) {
      // Meal is completed - unmark it
      const { error } = await supabase
        .from('meal_completions')
        .delete()
        .eq('email', email)
        .eq('date', date)
        .eq('meal_number', mealNumber)

      if (error) {
        console.error('Error unmarking meal:', error)
        return NextResponse.json({ error: 'Failed to unmark meal' }, { status: 500 })
      }

      return NextResponse.json({ success: true, completed: false })
    } else {
      // Meal is not completed - mark it
      const { error } = await supabase
        .from('meal_completions')
        .insert({
          email,
          date,
          meal_number: mealNumber,
        })

      if (error) {
        console.error('Error marking meal:', error)
        return NextResponse.json({ error: 'Failed to mark meal' }, { status: 500 })
      }

      return NextResponse.json({ success: true, completed: true })
    }
  } catch (error) {
    console.error('Error in meals/complete POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
