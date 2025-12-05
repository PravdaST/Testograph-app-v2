-- Fix trigger to use quiz_results_v2 instead of quiz_results
-- The old trigger was referencing non-existent table 'quiz_results'

-- First, add the access control columns to quiz_results_v2 if they don't exist
ALTER TABLE quiz_results_v2
ADD COLUMN IF NOT EXISTS has_active_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS access_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_type TEXT;

-- Comments
COMMENT ON COLUMN quiz_results_v2.has_active_access IS 'True if user has active access to the app';
COMMENT ON COLUMN quiz_results_v2.access_end_date IS 'Date when access expires (based on capsules)';
COMMENT ON COLUMN quiz_results_v2.access_type IS 'Type of access: sample (7 days) or full (30+ days)';

-- Drop the old trigger and function
DROP TRIGGER IF EXISTS trigger_update_access ON testoup_inventory;
DROP FUNCTION IF EXISTS update_user_access();

-- Recreate function to update user access based on inventory (using quiz_results_v2)
CREATE OR REPLACE FUNCTION update_user_access()
RETURNS TRIGGER AS $$
DECLARE
  access_end TIMESTAMP WITH TIME ZONE;
  access_active BOOLEAN;
  access_kind TEXT;
BEGIN
  -- Calculate access end date based on remaining capsules (2 capsules per day)
  access_end := NOW() + (NEW.capsules_remaining / 2 || ' days')::INTERVAL;

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

  -- Update quiz_results_v2 (FIXED: was quiz_results)
  UPDATE quiz_results_v2
  SET
    has_active_access = access_active,
    access_end_date = access_end,
    access_type = access_kind,
    access_start_date = COALESCE(access_start_date, NOW())
  WHERE email = NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger to auto-update access when inventory changes
CREATE TRIGGER trigger_update_access
  AFTER INSERT OR UPDATE OF capsules_remaining
  ON testoup_inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_user_access();
