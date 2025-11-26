import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyShopifyWebhook, parseShopifyOrder, findTestoUpProducts } from '@/lib/shopify/webhook'
import { sendPurchaseNotificationEmail } from '@/lib/email/welcome'

/**
 * POST /api/webhooks/shopify
 * Shopify webhook for paid orders (Orders/Paid event)
 * Automatically adds TestoUp capsules to user inventory when purchased
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for HMAC verification
    const rawBody = await request.text()

    // Get HMAC header
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256')

    if (!hmacHeader) {
      console.error('Missing HMAC header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify webhook authenticity
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('SHOPIFY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const isValid = verifyShopifyWebhook(rawBody, hmacHeader, webhookSecret)

    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    // Parse order data
    const order = parseShopifyOrder(JSON.parse(rawBody))

    if (!order) {
      console.error('Failed to parse order data')
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    console.log('Shopify webhook received:', {
      orderId: order.id,
      orderNumber: order.order_number,
      email: order.email,
      financialStatus: order.financial_status,
      totalPrice: order.total_price,
    })

    // Check if order is paid
    if (order.financial_status !== 'paid') {
      console.log('Order not paid yet, skipping:', order.financial_status)
      return NextResponse.json({
        success: true,
        message: 'Order not paid yet',
      })
    }

    // Extract customer email
    const customerEmail = order.email
    if (!customerEmail) {
      console.error('No customer email in order')
      return NextResponse.json({ error: 'No customer email' }, { status: 400 })
    }

    // Find TestoUp products in order
    const testoUpProducts = findTestoUpProducts(order)

    if (testoUpProducts.length === 0) {
      console.log('No TestoUp products in order')
      return NextResponse.json({
        success: true,
        message: 'No TestoUp products in order',
      })
    }

    // Calculate total capsules across all TestoUp products
    const totalCapsules = testoUpProducts.reduce((sum, p) => sum + p.totalCapsules, 0)
    const totalBottles = testoUpProducts.reduce((sum, p) => sum + p.quantity, 0)

    console.log(`Processing TestoUp purchase for ${customerEmail}:`)
    testoUpProducts.forEach(p => {
      console.log(`  - ${p.sku}: ${p.quantity}x ${p.capsules} = ${p.totalCapsules} capsules (${p.type})`)
    })
    console.log(`  Total: ${totalBottles} items, ${totalCapsules} capsules`)

    // Update inventory in database (using service role to bypass RLS)
    const supabase = createServiceClient()

    // Get current inventory
    const { data: currentInventory } = await (supabase
      .from('testoup_inventory') as any)
      .select('capsules_remaining, bottles_purchased, total_capsules')
      .eq('email', customerEmail)
      .maybeSingle()

    const currentCapsules = currentInventory?.capsules_remaining || 0
    const currentBottles = currentInventory?.bottles_purchased || 0
    const currentTotalCapsules = currentInventory?.total_capsules || 0
    const newCapsulesTotal = currentCapsules + totalCapsules
    const newBottlesTotal = currentBottles + totalBottles
    const newTotalCapsules = currentTotalCapsules + totalCapsules

    // Upsert inventory
    const { error: upsertError } = await (supabase
      .from('testoup_inventory') as any)
      .upsert(
        {
          email: customerEmail,
          total_capsules: newTotalCapsules,
          capsules_remaining: newCapsulesTotal,
          bottles_purchased: newBottlesTotal,
          last_refill_date: new Date().toISOString(),
          order_id: order.id.toString(),
        },
        {
          onConflict: 'email',
        }
      )

    if (upsertError) {
      console.error('Error updating inventory:', upsertError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Log each product purchase in history
    for (const product of testoUpProducts) {
      const { error: historyError } = await (supabase
        .from('testoup_purchase_history') as any)
        .insert({
          email: customerEmail,
          order_id: order.id.toString(),
          bottles_purchased: product.quantity,
          capsules_added: product.totalCapsules,
          order_date: order.created_at || new Date().toISOString(),
          order_total: parseFloat(order.total_price) / testoUpProducts.length, // Split total
          product_sku: product.sku,
          product_type: product.type,
        })

      if (historyError) {
        console.error('Error logging purchase history:', historyError)
        // Don't fail the webhook - inventory is already updated
      }
    }

    console.log(`✅ Successfully added ${totalCapsules} capsules to ${customerEmail}`)
    console.log(`   Capsules remaining: ${newCapsulesTotal}, Total received: ${newTotalCapsules} (${newBottlesTotal} bottles)`)

    // Check if user has already completed quiz
    const { data: quizResult } = await (supabase
      .from('quiz_results_v2') as any)
      .select('id')
      .eq('email', customerEmail)
      .maybeSingle()

    if (!quizResult) {
      // User hasn't completed quiz yet - send notification email
      console.log(`📧 User ${customerEmail} hasn't completed quiz, sending notification email...`)
      const emailSent = await sendPurchaseNotificationEmail({
        email: customerEmail,
        capsulesAdded: totalCapsules,
        totalCapsules: newCapsulesTotal,
        orderNumber: order.order_number?.toString(),
      })

      if (emailSent) {
        console.log(`✅ Purchase notification email sent to ${customerEmail}`)
      } else {
        console.error(`❌ Failed to send purchase notification email to ${customerEmail}`)
      }
    } else {
      console.log(`ℹ️ User ${customerEmail} has already completed quiz, skipping notification email`)
    }

    return NextResponse.json({
      success: true,
      bottlesAdded: totalBottles,
      capsulesAdded: totalCapsules,
      newTotal: newCapsulesTotal,
      newBottlesTotal: newBottlesTotal,
    })
  } catch (error) {
    console.error('Error in Shopify webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
