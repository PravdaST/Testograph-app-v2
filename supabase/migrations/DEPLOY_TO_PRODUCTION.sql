-- ===================================================================
-- PRODUCTION DEPLOYMENT SCRIPT
-- Sprint 2 & 3: Progress Tracking Tables
-- Deploy Date: 2025-11-25
-- ===================================================================
--
-- INSTRUCTIONS:
-- 1. Copy this entire SQL script
-- 2. Open Supabase Dashboard → SQL Editor
-- 3. Paste and run this script
-- 4. Manually create Storage bucket (see below)
--
-- ===================================================================

-- ===================================================================
-- TABLE 1: progress_photos
-- Stores user progress photos for before/after tracking
-- ===================================================================

CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  date DATE NOT NULL,
  weight NUMERIC(5, 2), -- kg (e.g., 75.50)
  body_fat_pct NUMERIC(4, 2), -- percentage (e.g., 15.50)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_progress_photos_email_date ON progress_photos(email, date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_email_created ON progress_photos(email, created_at DESC);

-- Enable Row Level Security
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own progress photos" ON progress_photos;
  DROP POLICY IF EXISTS "Users can insert own progress photos" ON progress_photos;
  DROP POLICY IF EXISTS "Users can update own progress photos" ON progress_photos;
  DROP POLICY IF EXISTS "Users can delete own progress photos" ON progress_photos;

  -- Create new policies
  CREATE POLICY "Users can view own progress photos"
    ON progress_photos
    FOR SELECT
    USING (email = current_setting('app.current_user_email', true));

  CREATE POLICY "Users can insert own progress photos"
    ON progress_photos
    FOR INSERT
    WITH CHECK (email = current_setting('app.current_user_email', true));

  CREATE POLICY "Users can update own progress photos"
    ON progress_photos
    FOR UPDATE
    USING (email = current_setting('app.current_user_email', true));

  CREATE POLICY "Users can delete own progress photos"
    ON progress_photos
    FOR DELETE
    USING (email = current_setting('app.current_user_email', true));
END $$;

-- Comments
COMMENT ON TABLE progress_photos IS 'User progress photos for visual tracking';
COMMENT ON COLUMN progress_photos.email IS 'User email (foreign key to quiz_results_v2)';
COMMENT ON COLUMN progress_photos.photo_url IS 'Supabase Storage URL to photo';
COMMENT ON COLUMN progress_photos.date IS 'Date when photo was taken';
COMMENT ON COLUMN progress_photos.weight IS 'Optional: User weight in kg at time of photo';
COMMENT ON COLUMN progress_photos.body_fat_pct IS 'Optional: Body fat percentage at time of photo';
COMMENT ON COLUMN progress_photos.notes IS 'Optional: User notes about this photo';

-- ===================================================================
-- TABLE 2: body_measurements
-- Tracks user body measurements over time
-- ===================================================================

CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  date DATE NOT NULL,
  weight NUMERIC(5, 2), -- kg (e.g., 75.50)
  body_fat_pct NUMERIC(4, 2), -- percentage (e.g., 15.50)
  waist NUMERIC(5, 2), -- cm (e.g., 85.00)
  chest NUMERIC(5, 2), -- cm (e.g., 100.00)
  arms NUMERIC(5, 2), -- cm (e.g., 35.00)
  legs NUMERIC(5, 2), -- cm (e.g., 55.00)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, date) -- One measurement per day per user
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_body_measurements_email_date ON body_measurements(email, date DESC);
CREATE INDEX IF NOT EXISTS idx_body_measurements_email_created ON body_measurements(email, created_at DESC);

-- Enable Row Level Security
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own body measurements" ON body_measurements;
  DROP POLICY IF EXISTS "Users can insert own body measurements" ON body_measurements;
  DROP POLICY IF EXISTS "Users can update own body measurements" ON body_measurements;
  DROP POLICY IF EXISTS "Users can delete own body measurements" ON body_measurements;

  -- Create new policies
  CREATE POLICY "Users can view own body measurements"
    ON body_measurements
    FOR SELECT
    USING (email = current_setting('app.current_user_email', true));

  CREATE POLICY "Users can insert own body measurements"
    ON body_measurements
    FOR INSERT
    WITH CHECK (email = current_setting('app.current_user_email', true));

  CREATE POLICY "Users can update own body measurements"
    ON body_measurements
    FOR UPDATE
    USING (email = current_setting('app.current_user_email', true));

  CREATE POLICY "Users can delete own body measurements"
    ON body_measurements
    FOR DELETE
    USING (email = current_setting('app.current_user_email', true));
END $$;

-- Comments
COMMENT ON TABLE body_measurements IS 'User body measurements for progress tracking';
COMMENT ON COLUMN body_measurements.email IS 'User email (foreign key to quiz_results_v2)';
COMMENT ON COLUMN body_measurements.date IS 'Date of measurement';
COMMENT ON COLUMN body_measurements.weight IS 'Body weight in kg';
COMMENT ON COLUMN body_measurements.body_fat_pct IS 'Body fat percentage';
COMMENT ON COLUMN body_measurements.waist IS 'Waist circumference in cm';
COMMENT ON COLUMN body_measurements.chest IS 'Chest circumference in cm';
COMMENT ON COLUMN body_measurements.arms IS 'Arms circumference in cm';
COMMENT ON COLUMN body_measurements.legs IS 'Legs circumference in cm';
COMMENT ON COLUMN body_measurements.notes IS 'Optional notes about this measurement';

-- ===================================================================
-- DEPLOYMENT VERIFICATION
-- ===================================================================

-- Check tables were created
DO $$
DECLARE
  photos_exists BOOLEAN;
  measurements_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'progress_photos'
  ) INTO photos_exists;

  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'body_measurements'
  ) INTO measurements_exists;

  IF photos_exists AND measurements_exists THEN
    RAISE NOTICE '✅ SUCCESS: Both tables created successfully!';
  ELSE
    RAISE WARNING '⚠️ WARNING: Some tables may not have been created!';
  END IF;
END $$;

-- ===================================================================
-- MANUAL STEPS REQUIRED AFTER RUNNING THIS SCRIPT:
-- ===================================================================
--
-- 1. CREATE STORAGE BUCKET (Required for photo uploads):
--    a. Go to Supabase Dashboard → Storage
--    b. Click "Create Bucket"
--    c. Bucket name: "progress-photos"
--    d. Public: YES (photos need to be accessible via public URLs)
--    e. File size limit: 5MB
--    f. Allowed MIME types: image/jpeg, image/png, image/webp
--
-- 2. VERIFY DEPLOYMENT:
--    a. Check that both tables appear in Database → Tables
--    b. Check that RLS is enabled on both tables
--    c. Check that storage bucket "progress-photos" exists
--
-- ===================================================================
