import { createHmac } from 'crypto'

/**
 * Verify Shopify webhook signature using HMAC
 *
 * @param rawBody - The raw request body as string
 * @param hmacHeader - The X-Shopify-Hmac-SHA256 header value
 * @param secret - Your Shopify webhook secret
 * @returns boolean - true if signature is valid
 */
export function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string,
  secret: string
): boolean {
  if (!hmacHeader || !secret) {
    console.error('Missing HMAC header or secret')
    return false
  }

  try {
    const hash = createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64')

    return hash === hmacHeader
  } catch (error) {
    console.error('Error verifying Shopify webhook:', error)
    return false
  }
}

/**
 * Parse Shopify order data from webhook payload
 */
export interface ShopifyOrder {
  id: number
  order_number: string
  email: string
  customer: {
    first_name: string
    last_name: string
    email: string
  }
  line_items: Array<{
    name: string
    sku?: string
    quantity: number
    price: string
  }>
  total_price: string
  financial_status: string
  created_at: string
}

export function parseShopifyOrder(payload: Record<string, unknown>): ShopifyOrder | null {
  try {
    if (!payload.id || !payload.email) {
      console.error('Invalid Shopify order payload')
      return null
    }

    const customer = payload.customer as Record<string, unknown> | undefined

    return {
      id: payload.id as number,
      order_number: (payload.order_number || payload.name) as string,
      email: payload.email as string,
      customer: {
        first_name: (customer?.first_name as string) || '',
        last_name: (customer?.last_name as string) || '',
        email: payload.email as string,
      },
      line_items: (payload.line_items || []) as Array<{
        name: string
        sku?: string
        quantity: number
        price: string
      }>,
      total_price: (payload.total_price || '0.00') as string,
      financial_status: (payload.financial_status || 'pending') as string,
      created_at: payload.created_at as string,
    }
  } catch (error) {
    console.error('Error parsing Shopify order:', error)
    return null
  }
}

/**
 * Product configuration
 */
export const PRODUCT_CONFIG = {
  'TUP-S14': { capsules: 14, type: 'sample' as const }, // Sample pack (7 days)
  'TESTOUP-60': { capsules: 60, type: 'full' as const }, // Full bottle (30 days)
  'TESTOUP': { capsules: 60, type: 'full' as const }, // Generic TestoUp
}

export interface TestoUpProduct {
  sku: string
  quantity: number
  capsules: number
  totalCapsules: number
  type: 'sample' | 'full'
}

/**
 * Find and parse TestoUp products in order
 * Returns detailed info about each TestoUp product
 */
export function findTestoUpProducts(order: ShopifyOrder): TestoUpProduct[] {
  const products: TestoUpProduct[] = []

  order.line_items.forEach((item) => {
    const productName = item.name?.toLowerCase() || ''
    const sku = item.sku?.toUpperCase() || ''

    // Check if product is TestoUp
    const isTestoUp =
      productName.includes('testoup') ||
      productName.includes('testo up') ||
      productName.includes('testo-up') ||
      sku.includes('TESTOUP') ||
      sku.includes('TUP-')

    if (!isTestoUp) return

    // Determine product type and capsules
    let capsules = 60 // Default full bottle
    let type: 'sample' | 'full' = 'full'

    // Check SKU against known products
    for (const [productSku, config] of Object.entries(PRODUCT_CONFIG)) {
      if (sku.includes(productSku)) {
        capsules = config.capsules
        type = config.type
        break
      }
    }

    // If no SKU match but name contains "sample", assume sample
    if (productName.includes('sample') || productName.includes('проба')) {
      capsules = 14
      type = 'sample'
    }

    products.push({
      sku: item.sku || 'UNKNOWN',
      quantity: item.quantity || 1,
      capsules,
      totalCapsules: capsules * (item.quantity || 1),
      type,
    })
  })

  return products
}
