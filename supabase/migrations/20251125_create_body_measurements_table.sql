-- Body Measurements Table
-- Tracks user body measurements over time (weight, body fat, circumferences)

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
CREATE INDEX idx_body_measurements_email_date ON body_measurements(email, date DESC);
CREATE INDEX idx_body_measurements_email_created ON body_measurements(email, created_at DESC);

-- Enable Row Level Security
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own measurements
CREATE POLICY "Users can view own body measurements"
  ON body_measurements
  FOR SELECT
  USING (email = current_setting('app.current_user_email', true));

-- Users can insert their own measurements
CREATE POLICY "Users can insert own body measurements"
  ON body_measurements
  FOR INSERT
  WITH CHECK (email = current_setting('app.current_user_email', true));

-- Users can update their own measurements
CREATE POLICY "Users can update own body measurements"
  ON body_measurements
  FOR UPDATE
  USING (email = current_setting('app.current_user_email', true));

-- Users can delete their own measurements
CREATE POLICY "Users can delete own body measurements"
  ON body_measurements
  FOR DELETE
  USING (email = current_setting('app.current_user_email', true));

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
