import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyShopifyWebhook, parseShopifyOrder, findTestoUpProducts } from '@/lib/shopify/webhook'

/**
 * POST /api/webhooks/shopify/order-created
 * Shopify webhook for created orders (Orders/Create event)
 * Records pending orders BEFORE payment to prevent showing offers to customers who already ordered
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for HMAC verification
    const rawBody = await request.text()

    // Get HMAC header
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256')

    if (!hmacHeader) {
      console.error('[order-created] Missing HMAC header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify webhook authenticity
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('[order-created] SHOPIFY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const isValid = verifyShopifyWebhook(rawBody, hmacHeader, webhookSecret)

    if (!isValid) {
      console.error('[order-created] Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    // Parse order data
    const order = parseShopifyOrder(JSON.parse(rawBody))

    if (!order) {
      console.error('[order-created] Failed to parse order data')
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    console.log('[order-created] Webhook received:', {
      orderId: order.id,
      orderNumber: order.order_number,
      email: order.email,
      financialStatus: order.financial_status,
      totalPrice: order.total_price,
    })

    // Extract customer email
    const customerEmail = order.email
    if (!customerEmail) {
      console.error('[order-created] No customer email in order')
      return NextResponse.json({ error: 'No customer email' }, { status: 400 })
    }

    // Find TestoUp products in order
    const testoUpProducts = findTestoUpProducts(order)

    if (testoUpProducts.length === 0) {
      console.log('[order-created] No TestoUp products in order, skipping')
      return NextResponse.json({
        success: true,
        message: 'No TestoUp products in order',
      })
    }

    // Determine initial status based on financial_status
    let status = 'pending'
    if (order.financial_status === 'paid') {
      status = 'paid'
    } else if (order.financial_status === 'refunded') {
      status = 'refunded'
    } else if (order.financial_status === 'voided') {
      status = 'cancelled'
    }

    // Store order in pending_orders table
    const supabase = createServiceClient()

    const { error: upsertError } = await (supabase
      .from('pending_orders') as any)
      .upsert(
        {
          email: customerEmail,
          order_id: order.id.toString(),
          order_number: order.order_number?.toString(),
          status: status,
          total_price: parseFloat(order.total_price),
          currency: 'BGN',
          products: testoUpProducts,
          customer_name: order.customer?.first_name
            ? `${order.customer.first_name} ${order.customer.last_name}`.trim()
            : null,
          updated_at: new Date().toISOString(),
          paid_at: status === 'paid' ? new Date().toISOString() : null,
        },
        {
          onConflict: 'order_id',
        }
      )

    if (upsertError) {
      console.error('[order-created] Error saving pending order:', upsertError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log(`[order-created] Saved pending order for ${customerEmail}:`, {
      orderId: order.id,
      status,
      products: testoUpProducts.length,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status,
      email: customerEmail,
    })
  } catch (error) {
    console.error('[order-created] Error in webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
