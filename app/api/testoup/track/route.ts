import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * POST /api/testoup/track
 * Track TestoUp intake (morning or evening)
 *
 * SECURITY: Requires valid session, users can only track their own data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: bodyEmail, date, period } = body // period: 'morning' | 'evening'

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(bodyEmail)
    if (authError) return authError

    if (!date || !period) {
      return NextResponse.json(
        { error: 'Date and period are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get or create tracking record for today
    const { data: existing, error: fetchError } = await (supabase
      .from('testoup_tracking') as any)
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
      const { data, error } = await (supabase
        .from('testoup_tracking') as any)
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
      const { data, error } = await (supabase
        .from('testoup_tracking') as any)
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

    const supabase = createServiceClient()

    const { data, error } = await (supabase
      .from('testoup_tracking') as any)
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

/**
 * DELETE /api/testoup/track
 * Undo TestoUp intake (morning or evening)
 *
 * SECURITY: Requires valid session, users can only undo their own data
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')
    const date = searchParams.get('date')
    const period = searchParams.get('period') // 'morning' | 'evening'

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(queryEmail)
    if (authError) return authError

    if (!date || !period) {
      return NextResponse.json(
        { error: 'Date and period are required' },
        { status: 400 }
      )
    }

    if (period !== 'morning' && period !== 'evening') {
      return NextResponse.json(
        { error: 'Period must be morning or evening' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get existing tracking record
    const { data: existing, error: fetchError } = await (supabase
      .from('testoup_tracking') as any)
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching tracking:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!existing) {
      return NextResponse.json({ error: 'No tracking record found' }, { status: 404 })
    }

    const fieldToUpdate = period === 'morning' ? 'morning_taken' : 'evening_taken'

    // Check if the dose was actually taken
    if (!existing[fieldToUpdate]) {
      return NextResponse.json({ error: 'Dose was not marked as taken' }, { status: 400 })
    }

    // Update to set period to false
    const { data, error } = await (supabase
      .from('testoup_tracking') as any)
      .update({
        [fieldToUpdate]: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('date', date)
      .select()
      .single()

    if (error) {
      console.error('Error updating tracking:', error)
      return NextResponse.json({ error: 'Failed to undo tracking' }, { status: 500 })
    }

    // Increase capsule count back
    await increaseCapsuleCount(supabase, email)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in testoup track DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function increaseCapsuleCount(supabase: SupabaseClient, email: string) {
  // Get current inventory
  const { data: inventory, error: fetchError } = await (supabase
    .from('testoup_inventory') as any)
    .select('*')
    .eq('email', email)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching inventory:', fetchError)
    return
  }

  if (inventory) {
    // Increase by 1 capsule
    const newCount = inventory.capsules_remaining + 1

    await (supabase
      .from('testoup_inventory') as any)
      .update({
        capsules_remaining: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
  }
}

async function decreaseCapsuleCount(supabase: SupabaseClient, email: string) {
  // Get current inventory
  const { data: inventory, error: fetchError } = await (supabase
    .from('testoup_inventory') as any)
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

    await (supabase
      .from('testoup_inventory') as any)
      .update({
        capsules_remaining: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
  } else {
    // Initialize inventory with 59 (already took 1)
    await (supabase
      .from('testoup_inventory') as any)
      .insert({
        email,
        total_capsules: 60,
        capsules_remaining: 59,
        last_refill_date: new Date().toISOString()
      })
  }
}
