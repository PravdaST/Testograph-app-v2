-- Create meal_completions table for tracking completed meals
CREATE TABLE IF NOT EXISTS meal_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  date DATE NOT NULL,
  meal_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, date, meal_number)
);

-- Index for faster queries by email and date
CREATE INDEX IF NOT EXISTS idx_meal_completions_email_date
ON meal_completions(email, date);

-- Comments
COMMENT ON TABLE meal_completions IS 'Tracks which meals users have completed each day';
COMMENT ON COLUMN meal_completions.meal_number IS 'Meal number (1-5) for the day';
