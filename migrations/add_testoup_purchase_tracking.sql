-- Add purchase tracking fields to testoup_inventory
ALTER TABLE testoup_inventory
ADD COLUMN IF NOT EXISTS bottles_purchased INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS last_refill_date TIMESTAMP WITH TIME ZONE;

-- Create purchase history table
CREATE TABLE IF NOT EXISTS testoup_purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  order_id TEXT,
  bottles_purchased INTEGER NOT NULL,
  capsules_added INTEGER NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL,
  order_total NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_testoup_purchases_email
ON testoup_purchase_history(email);

CREATE INDEX IF NOT EXISTS idx_testoup_purchases_order_id
ON testoup_purchase_history(order_id);

-- Comments
COMMENT ON TABLE testoup_purchase_history IS 'Tracks all TestoUp purchases from Shopify';
COMMENT ON COLUMN testoup_purchase_history.bottles_purchased IS 'Number of TestoUp bottles purchased in this order';
COMMENT ON COLUMN testoup_purchase_history.capsules_added IS 'Total capsules added (bottles * 60)';
COMMENT ON COLUMN testoup_inventory.bottles_purchased IS 'Total bottles purchased by user (lifetime)';
