-- Create pending_orders table for tracking Shopify orders before payment
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  order_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  total_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'BGN',
  products JSONB,
  customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_pending_orders_email ON pending_orders(email);
CREATE INDEX IF NOT EXISTS idx_pending_orders_status ON pending_orders(status);
CREATE INDEX IF NOT EXISTS idx_pending_orders_order_id ON pending_orders(order_id);

-- RLS policies
ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for webhooks)
CREATE POLICY pending_orders_service_policy ON pending_orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
