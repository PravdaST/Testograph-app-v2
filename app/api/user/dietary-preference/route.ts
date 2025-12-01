import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

type DietaryPreference = 'omnivor' | 'pescatarian' | 'vegetarian' | 'vegan'

const VALID_PREFERENCES: DietaryPreference[] = ['omnivor', 'pescatarian', 'vegetarian', 'vegan']

/**
 * GET /api/user/dietary-preference
 * Get user's dietary preference
 *
 * Expects: email in query params
 * Returns: { dietary_preference }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user's dietary preference from quiz_results_v2 table
    const { data: quizResult, error } = await (supabase
      .from('quiz_results_v2') as any)
      .select('dietary_preference')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching dietary preference:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // If user not found, return default
    if (!quizResult) {
      return NextResponse.json({ dietary_preference: 'omnivor' })
    }

    return NextResponse.json({
      dietary_preference: quizResult.dietary_preference || 'omnivor',
    })
  } catch (error) {
    console.error('Error in GET dietary-preference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/user/dietary-preference
 * Update user's dietary preference
 *
 * Expects: { email, dietary_preference }
 * Returns: { success: true, dietary_preference }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, dietary_preference } = body

    // Validate input
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!dietary_preference) {
      return NextResponse.json({ error: 'Dietary preference is required' }, { status: 400 })
    }

    if (!VALID_PREFERENCES.includes(dietary_preference)) {
      return NextResponse.json(
        {
          error: `Invalid dietary preference. Must be one of: ${VALID_PREFERENCES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if quiz result exists for user
    const { data: existingResult } = await (supabase
      .from('quiz_results_v2') as any)
      .select('id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!existingResult) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update dietary preference in quiz_results_v2
    const { error: updateError } = await (supabase
      .from('quiz_results_v2') as any)
      .update({ dietary_preference })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating dietary preference:', updateError)
      return NextResponse.json({ error: 'Failed to update preference' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      dietary_preference,
      message: 'Dietary preference updated successfully',
    })
  } catch (error) {
    console.error('Error in POST dietary-preference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/user/dietary-preference
 * Alternative method to update dietary preference
 * Same functionality as POST
 */
export async function PATCH(request: NextRequest) {
  return POST(request)
}
