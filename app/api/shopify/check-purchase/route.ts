import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/shopify/check-purchase
 * Check if user has any TestoUp purchases
 * Note: Uses service client to bypass RLS since this is called from results page without session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check if user has any purchase history
    const { data: purchaseHistory, error: historyError } = await (supabase
      .from('testoup_purchase_history') as any)
      .select('id, capsules_added, order_date, product_sku')
      .eq('email', email)
      .limit(1)

    if (historyError) {
      console.error('Error checking purchase history:', historyError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Check if user has inventory
    const { data: inventory, error: inventoryError } = await (supabase
      .from('testoup_inventory') as any)
      .select('capsules_remaining, bottles_purchased')
      .eq('email', email)
      .maybeSingle()

    if (inventoryError) {
      console.error('Error checking inventory:', inventoryError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const hasPurchased =
      (purchaseHistory && purchaseHistory.length > 0) ||
      (inventory && inventory.bottles_purchased > 0)

    return NextResponse.json({
      hasPurchased,
      inventory: inventory || null,
      latestPurchase: purchaseHistory && purchaseHistory.length > 0 ? purchaseHistory[0] : null,
    })
  } catch (error) {
    console.error('Error in check-purchase endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
