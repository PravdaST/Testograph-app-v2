-- Create daily_progress_scores table for tracking progressive improvement
CREATE TABLE IF NOT EXISTS public.daily_progress_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  compliance_percentage INTEGER NOT NULL CHECK (compliance_percentage >= 0 AND compliance_percentage <= 100),
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  total_tasks INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one score per user per day
  UNIQUE(email, date)
);

-- Create index for faster queries
CREATE INDEX idx_daily_progress_scores_email_date ON public.daily_progress_scores(email, date DESC);

-- Add RLS policies
ALTER TABLE public.daily_progress_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own scores
CREATE POLICY "Users can read own daily progress scores"
  ON public.daily_progress_scores
  FOR SELECT
  USING (true);

-- Policy: Service role can insert/update scores
CREATE POLICY "Service role can manage daily progress scores"
  ON public.daily_progress_scores
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_daily_progress_scores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER update_daily_progress_scores_updated_at
  BEFORE UPDATE ON public.daily_progress_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_progress_scores_updated_at();

-- Comment on table
COMMENT ON TABLE public.daily_progress_scores IS 'Tracks daily progressive improvement scores (0-100) based on program compliance';
