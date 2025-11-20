import fetch from 'node-fetch'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const sql = `
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
  UNIQUE(email, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_progress_scores_email_date ON public.daily_progress_scores(email, date DESC);

ALTER TABLE public.daily_progress_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own daily progress scores" ON public.daily_progress_scores;
CREATE POLICY "Users can read own daily progress scores"
  ON public.daily_progress_scores
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage daily progress scores" ON public.daily_progress_scores;
CREATE POLICY "Service role can manage daily progress scores"
  ON public.daily_progress_scores
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_daily_progress_scores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_daily_progress_scores_updated_at ON public.daily_progress_scores;
CREATE TRIGGER update_daily_progress_scores_updated_at
  BEFORE UPDATE ON public.daily_progress_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_progress_scores_updated_at();

COMMENT ON TABLE public.daily_progress_scores IS 'Tracks daily progressive improvement scores (0-100) based on program compliance';
`

async function createTable() {
  console.log('\n🚀 Creating daily_progress_scores table in Supabase...\n')
  console.log('📋 SQL to execute:')
  console.log('='.repeat(80))
  console.log(sql)
  console.log('='.repeat(80))
  console.log('\n⚠️  Note: This requires manual execution in Supabase SQL Editor')
  console.log('\n📝 Steps:')
  console.log('1. Go to: https://supabase.com/dashboard/project/mrpsaqtmucxpawajfxfn/sql/new')
  console.log('2. Copy the SQL above')
  console.log('3. Paste into SQL Editor')
  console.log('4. Click "Run" button')
  console.log('\n✅ Once executed, the table will be ready!')
}

createTable()
