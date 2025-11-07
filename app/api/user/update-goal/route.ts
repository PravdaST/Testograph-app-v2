import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/user/update-goal
 * Update user's goal for the 30-day program
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, goal } = body

    if (!email || !goal) {
      return NextResponse.json(
        { error: 'Email and goal are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update the goal for the user's latest quiz result
    const { error } = await supabase
      .from('quiz_results_v2')
      .update({ goal: goal.trim() })
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error updating goal:', error)
      return NextResponse.json(
        { error: 'Failed to update goal' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in update-goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
