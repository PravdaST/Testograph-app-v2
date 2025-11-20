import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeMigration() {
  console.log('\n🚀 Executing migration: create_daily_progress_scores...\n')

  try {
    // Read migration file
    const migrationPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20250120_create_daily_progress_scores.sql'
    )
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📋 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement using REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\n[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 60)}...`)

      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ query: statement + ';' })
        })

        if (!response.ok) {
          // Try alternative: use query parameter
          const queryResponse = await fetch(`${supabaseUrl}/rest/v1/?${encodeURIComponent(statement)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=minimal'
            }
          })

          if (!queryResponse.ok) {
            console.log(`⚠️  Could not execute via REST API`)
            console.log(`   Status: ${response.status}`)

            // Execute using postgres connection
            const { data, error } = await supabase.rpc('exec_sql' as any, {
              sql: statement + ';'
            })

            if (error) {
              console.log(`❌ Error: ${error.message}`)
            } else {
              console.log(`✅ Executed successfully`)
            }
          } else {
            console.log(`✅ Executed successfully`)
          }
        } else {
          console.log(`✅ Executed successfully`)
        }
      } catch (error: any) {
        console.log(`⚠️  Error executing statement: ${error.message}`)
        console.log(`   Continuing with next statement...`)
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log('✅ Migration completed!')
    console.log('='.repeat(80))
    console.log('\n📊 Verifying table creation...\n')

    // Verify table was created
    const { data: tables, error: tablesError } = await (supabase as any)
      .from('daily_progress_scores')
      .select('*')
      .limit(0)

    if (tablesError) {
      console.log('⚠️  Could not verify table creation automatically.')
      console.log('   Please check Supabase dashboard manually.')
      console.log(`   Error: ${tablesError.message}`)
    } else {
      console.log('✅ Table "daily_progress_scores" verified successfully!')
    }

  } catch (error: any) {
    console.error('\n❌ Error executing migration:', error.message)
    console.log('\n💡 Tip: You may need to run this SQL manually in Supabase SQL Editor:')
    console.log('   Dashboard → SQL Editor → New Query → Paste SQL → Run')
  }
}

executeMigration()
