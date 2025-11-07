import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * POST /api/testoup/track
 * Track TestoUp intake (morning or evening)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, date, period } = body // period: 'morning' | 'evening'

    if (!email || !date || !period) {
      return NextResponse.json(
        { error: 'Email, date, and period are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get or create tracking record for today
    const { data: existing, error: fetchError } = await supabase
      .from('testoup_tracking')
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching tracking:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const fieldToUpdate = period === 'morning' ? 'morning_taken' : 'evening_taken'

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('testoup_tracking')
        .update({
          [fieldToUpdate]: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .eq('date', date)
        .select()
        .single()

      if (error) {
        console.error('Error updating tracking:', error)
        return NextResponse.json({ error: 'Failed to update tracking' }, { status: 500 })
      }

      // Decrease capsule count
      await decreaseCapsuleCount(supabase, email)

      return NextResponse.json({ success: true, data })
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('testoup_tracking')
        .insert({
          email,
          date,
          [fieldToUpdate]: true
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating tracking:', error)
        return NextResponse.json({ error: 'Failed to create tracking' }, { status: 500 })
      }

      // Decrease capsule count
      await decreaseCapsuleCount(supabase, email)

      return NextResponse.json({ success: true, data })
    }
  } catch (error) {
    console.error('Error in testoup track:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/testoup/track
 * Get TestoUp tracking for a specific date
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
      .from('testoup_tracking')
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching tracking:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({
      morning_taken: data?.morning_taken || false,
      evening_taken: data?.evening_taken || false
    })
  } catch (error) {
    console.error('Error in testoup track GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function decreaseCapsuleCount(supabase: SupabaseClient, email: string) {
  // Get current inventory
  const { data: inventory, error: fetchError } = await supabase
    .from('testoup_inventory')
    .select('*')
    .eq('email', email)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching inventory:', fetchError)
    return
  }

  if (inventory) {
    // Decrease by 1 capsule
    const newCount = Math.max(0, inventory.capsules_remaining - 1)

    await supabase
      .from('testoup_inventory')
      .update({
        capsules_remaining: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
  } else {
    // Initialize inventory with 59 (already took 1)
    await supabase
      .from('testoup_inventory')
      .insert({
        email,
        total_capsules: 60,
        capsules_remaining: 59,
        last_refill_date: new Date().toISOString()
      })
  }
}
