import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * GET /api/meals/complete
 * Get completed meals for a specific date
 *
 * SECURITY: Requires valid session, users can only access their own data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')
    const date = searchParams.get('date')

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(queryEmail)
    if (authError) return authError

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await (supabase
      .from('meal_completions') as any)
      .select('meal_number')
      .eq('email', email)
      .eq('date', date)

    if (error) {
      console.error('Error fetching meal completions:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Return array of completed meal numbers
    const completedMeals = data.map((item: any) => item.meal_number)
    return NextResponse.json({ completedMeals })
  } catch (error) {
    console.error('Error in meals/complete GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/meals/complete
 * Toggle meal completion (mark or unmark)
 *
 * SECURITY: Requires valid session, users can only modify their own data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: bodyEmail, date, mealNumber } = body

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(bodyEmail)
    if (authError) return authError

    if (!date || mealNumber === undefined) {
      return NextResponse.json(
        { error: 'Date and mealNumber are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if meal is already completed
    const { data: existing } = await (supabase
      .from('meal_completions') as any)
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .eq('meal_number', mealNumber)
      .maybeSingle()

    if (existing) {
      // Meal is completed - unmark it
      const { error } = await (supabase
        .from('meal_completions') as any)
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
      const { error } = await (supabase
        .from('meal_completions') as any)
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
