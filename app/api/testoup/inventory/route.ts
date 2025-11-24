import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * GET /api/testoup/inventory
 * Get TestoUp capsule inventory for user
 *
 * SECURITY: Requires valid session, users can only access their own inventory
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(queryEmail)
    if (authError) return authError

    const supabase = createServiceClient()

    const { data, error } = await (supabase
      .from('testoup_inventory') as any)
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching inventory:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!data) {
      // Return default new bottle
      return NextResponse.json({
        total_capsules: 60,
        capsules_remaining: 60,
        days_remaining: 30,
        percentage_remaining: 100,
        bottles_purchased: 1,
        bottles_remaining: 1
      })
    }

    const daysRemaining = Math.ceil(data.capsules_remaining / 2)
    const totalBottles = Math.ceil((data.bottles_purchased || 1) * 60 / 60) // Total bottles ever purchased
    const bottlesRemaining = Math.ceil(data.capsules_remaining / 60) // Bottles remaining based on capsules
    const percentageRemaining = totalBottles > 0
      ? Math.round((data.capsules_remaining / (totalBottles * 60)) * 100)
      : 0

    return NextResponse.json({
      total_capsules: totalBottles * 60,
      capsules_remaining: data.capsules_remaining,
      days_remaining: daysRemaining,
      percentage_remaining: percentageRemaining,
      bottles_purchased: data.bottles_purchased || 1,
      bottles_remaining: bottlesRemaining,
      last_refill_date: data.last_refill_date
    })
  } catch (error) {
    console.error('Error in testoup inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/testoup/inventory
 * Refill TestoUp inventory (new bottle)
 *
 * SECURITY: Requires valid session, users can only refill their own inventory
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: bodyEmail } = body

    // Validate session and get authenticated user's email
    const { email, error: authError } = await validateSessionAndEmail(bodyEmail)
    if (authError) return authError

    const supabase = createServiceClient()

    // Check if inventory exists
    const { data: existing } = await (supabase
      .from('testoup_inventory') as any)
      .select('*')
      .eq('email', email)
      .single()

    if (existing) {
      // Add new bottle (+60 capsules)
      const newBottlesCount = (existing.bottles_purchased || 0) + 1
      const newCapsulesRemaining = existing.capsules_remaining + 60

      const { data, error } = await (supabase
        .from('testoup_inventory') as any)
        .update({
          capsules_remaining: newCapsulesRemaining,
          bottles_purchased: newBottlesCount,
          last_refill_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (error) {
        console.error('Error updating inventory:', error)
        return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
      }

      // Log manual refill in purchase history
      await (supabase
        .from('testoup_purchase_history') as any)
        .insert({
          email,
          order_id: 'MANUAL_REFILL',
          bottles_purchased: 1,
          capsules_added: 60,
          order_date: new Date().toISOString(),
        })

      return NextResponse.json({
        success: true,
        data,
        bottlesAdded: 1,
        newTotal: newCapsulesRemaining
      })
    } else {
      // Create new inventory (first bottle)
      const { data, error } = await (supabase
        .from('testoup_inventory') as any)
        .insert({
          email,
          total_capsules: 60,
          capsules_remaining: 60,
          bottles_purchased: 1,
          last_refill_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating inventory:', error)
        return NextResponse.json({ error: 'Failed to create inventory' }, { status: 500 })
      }

      // Log first bottle in purchase history
      await (supabase
        .from('testoup_purchase_history') as any)
        .insert({
          email,
          order_id: 'MANUAL_REFILL',
          bottles_purchased: 1,
          capsules_added: 60,
          order_date: new Date().toISOString(),
        })

      return NextResponse.json({
        success: true,
        data,
        bottlesAdded: 1,
        newTotal: 60
      })
    }
  } catch (error) {
    console.error('Error in testoup inventory POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
