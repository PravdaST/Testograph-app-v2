import { Client } from 'pg'

// Supabase connection pooler connection string (Transaction mode)
const connectionString = 'postgresql://postgres.mrpsaqtmucxpawajfxfn:Testograph2025!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'

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
  const client = new Client({ connectionString })

  try {
    console.log('\n🚀 Connecting to Supabase PostgreSQL...\n')
    await client.connect()
    console.log('✅ Connected successfully!\n')

    console.log('📋 Creating daily_progress_scores table...\n')
    await client.query(sql)

    console.log('✅ Table created successfully!\n')

    // Verify table exists
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'daily_progress_scores'
    `)

    if (result.rows.length > 0) {
      console.log('✅ Verification: Table "daily_progress_scores" exists in database\n')
    } else {
      console.log('⚠️  Warning: Could not verify table creation\n')
    }

    console.log('='.repeat(80))
    console.log('🎉 Migration completed successfully!')
    console.log('='.repeat(80))

  } catch (error: any) {
    console.error('\n❌ Error creating table:', error.message)
    console.error('\nFull error:', error)
  } finally {
    await client.end()
  }
}

createTable()
