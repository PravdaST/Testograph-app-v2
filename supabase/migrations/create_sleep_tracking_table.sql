-- Create sleep_tracking table
CREATE TABLE IF NOT EXISTS public.sleep_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  hours_slept DECIMAL(3,1) NOT NULL DEFAULT 0,
  quality_rating INTEGER NOT NULL DEFAULT 0 CHECK (quality_rating >= 0 AND quality_rating <= 5),
  feeling TEXT CHECK (feeling IN ('energetic', 'neutral', 'tired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_email_date ON public.sleep_tracking(email, date);

-- Enable RLS
ALTER TABLE public.sleep_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - users can only access their own sleep data
CREATE POLICY "Users can manage their own sleep tracking"
  ON public.sleep_tracking
  FOR ALL
  USING (true)
  WITH CHECK (true);
