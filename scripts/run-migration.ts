import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('\n🚀 Running migration: create_daily_progress_scores...\n')

  try {
    // Read migration file
    const migrationPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20250120_create_daily_progress_scores.sql'
    )
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Execute migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

    if (error) {
      // Try alternative approach - execute directly
      const statements = migrationSQL
        .split(';')
        .filter((s) => s.trim().length > 0)

      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`)
        const { error: execError } = await (supabase as any).from('_').select('*').limit(0)

        // Since we can't execute raw SQL directly, we'll use the REST API
        console.log('⚠️  Note: Migration needs to be run manually in Supabase SQL Editor')
        console.log('\n📋 Copy the following SQL to Supabase SQL Editor:\n')
        console.log('=' .repeat(80))
        console.log(migrationSQL)
        console.log('='.repeat(80))
        break
      }
    } else {
      console.log('✅ Migration executed successfully!')
    }
  } catch (error) {
    console.error('❌ Error running migration:', error)
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:')
    console.log('=' .repeat(80))
    const migrationPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20250120_create_daily_progress_scores.sql'
    )
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    console.log(migrationSQL)
    console.log('='.repeat(80))
  }
}

runMigration()
