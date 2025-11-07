-- Add access control to quiz_results
ALTER TABLE quiz_results
ADD COLUMN IF NOT EXISTS has_active_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS access_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_type TEXT; -- 'sample' or 'full'

-- Add product mapping to testoup_purchase_history
ALTER TABLE testoup_purchase_history
ADD COLUMN IF NOT EXISTS product_sku TEXT,
ADD COLUMN IF NOT EXISTS product_type TEXT; -- 'sample' or 'full'

-- Comments
COMMENT ON COLUMN quiz_results.has_active_access IS 'True if user has active access to the app';
COMMENT ON COLUMN quiz_results.access_end_date IS 'Date when access expires (based on capsules)';
COMMENT ON COLUMN quiz_results.access_type IS 'Type of access: sample (7 days) or full (30+ days)';
COMMENT ON COLUMN testoup_purchase_history.product_sku IS 'Shopify product SKU (e.g., TUP-S14, TESTOUP-60)';
COMMENT ON COLUMN testoup_purchase_history.product_type IS 'Product type: sample or full';

-- Function to calculate access end date based on capsules
CREATE OR REPLACE FUNCTION calculate_access_end_date(capsules INTEGER)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  -- 2 capsules per day
  RETURN NOW() + (capsules / 2 || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Function to update user access based on inventory
CREATE OR REPLACE FUNCTION update_user_access()
RETURNS TRIGGER AS $$
DECLARE
  access_end TIMESTAMP WITH TIME ZONE;
  access_active BOOLEAN;
  access_kind TEXT;
BEGIN
  -- Calculate access end date based on remaining capsules
  access_end := calculate_access_end_date(NEW.capsules_remaining);

  -- Check if access is active
  access_active := NEW.capsules_remaining > 0 AND access_end > NOW();

  -- Determine access type
  IF NEW.capsules_remaining >= 60 THEN
    access_kind := 'full';
  ELSIF NEW.capsules_remaining > 0 THEN
    access_kind := 'sample';
  ELSE
    access_kind := NULL;
  END IF;

  -- Update quiz_results
  UPDATE quiz_results
  SET
    has_active_access = access_active,
    access_end_date = access_end,
    access_type = access_kind,
    access_start_date = COALESCE(access_start_date, NOW())
  WHERE email = NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update access when inventory changes
DROP TRIGGER IF EXISTS trigger_update_access ON testoup_inventory;
CREATE TRIGGER trigger_update_access
  AFTER INSERT OR UPDATE OF capsules_remaining
  ON testoup_inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_user_access();
