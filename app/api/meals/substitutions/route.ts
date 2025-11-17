import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SubstitutedMeal } from '@/lib/utils/dietary-substitution'

/**
 * GET /api/meals/substitutions
 * Get substituted meals for a specific date
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

    const { data, error } = await (supabase
      .from('meal_substitutions') as any)
      .select('meal_number, substituted_meal')
      .eq('email', email)
      .eq('date', date)

    if (error) {
      console.error('Error fetching meal substitutions:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Convert array to object: { mealNumber: substitutedMeal }
    const substitutions: Record<number, SubstitutedMeal> = {}
    data.forEach((item: any) => {
      substitutions[item.meal_number] = item.substituted_meal
    })

    return NextResponse.json({ substitutions })
  } catch (error) {
    console.error('Error in meals/substitutions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/meals/substitutions
 * Save a substituted meal
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, date, mealNumber, substitutedMeal } = body

    if (!email || !date || mealNumber === undefined || !substitutedMeal) {
      return NextResponse.json(
        { error: 'Email, date, mealNumber, and substitutedMeal are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Upsert: insert or update if exists
    const { error } = await (supabase
      .from('meal_substitutions') as any)
      .upsert({
        email,
        date,
        meal_number: mealNumber,
        substituted_meal: substitutedMeal,
      }, {
        onConflict: 'email,date,meal_number'
      })

    if (error) {
      console.error('Error saving meal substitution:', error)
      return NextResponse.json({ error: 'Failed to save substitution' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in meals/substitutions POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/meals/substitutions
 * Remove a substituted meal (undo substitution)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')
    const mealNumber = searchParams.get('mealNumber')

    if (!email || !date || !mealNumber) {
      return NextResponse.json(
        { error: 'Email, date, and mealNumber are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await (supabase
      .from('meal_substitutions') as any)
      .delete()
      .eq('email', email)
      .eq('date', date)
      .eq('meal_number', parseInt(mealNumber))

    if (error) {
      console.error('Error deleting meal substitution:', error)
      return NextResponse.json({ error: 'Failed to delete substitution' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in meals/substitutions DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
