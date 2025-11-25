-- Progress Photos Table
-- Stores user progress photos for before/after tracking

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
CREATE INDEX idx_progress_photos_email_date ON progress_photos(email, date DESC);
CREATE INDEX idx_progress_photos_email_created ON progress_photos(email, created_at DESC);

-- Enable Row Level Security
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own photos
CREATE POLICY "Users can view own progress photos"
  ON progress_photos
  FOR SELECT
  USING (email = current_setting('app.current_user_email', true));

-- Users can insert their own photos
CREATE POLICY "Users can insert own progress photos"
  ON progress_photos
  FOR INSERT
  WITH CHECK (email = current_setting('app.current_user_email', true));

-- Users can update their own photos
CREATE POLICY "Users can update own progress photos"
  ON progress_photos
  FOR UPDATE
  USING (email = current_setting('app.current_user_email', true));

-- Users can delete their own photos
CREATE POLICY "Users can delete own progress photos"
  ON progress_photos
  FOR DELETE
  USING (email = current_setting('app.current_user_email', true));

-- Comments
COMMENT ON TABLE progress_photos IS 'User progress photos for visual tracking';
COMMENT ON COLUMN progress_photos.email IS 'User email (foreign key to quiz_results_v2)';
COMMENT ON COLUMN progress_photos.photo_url IS 'Supabase Storage URL to photo';
COMMENT ON COLUMN progress_photos.date IS 'Date when photo was taken';
COMMENT ON COLUMN progress_photos.weight IS 'Optional: User weight in kg at time of photo';
COMMENT ON COLUMN progress_photos.body_fat_pct IS 'Optional: Body fat percentage at time of photo';
COMMENT ON COLUMN progress_photos.notes IS 'Optional: User notes about this photo';
