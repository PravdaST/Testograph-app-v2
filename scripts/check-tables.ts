/**
 * Check Real Database Tables
 * Lists all tables in Supabase database
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Checking real database tables...\n')

  try {
    // Query pg_tables to get all tables in public schema
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .order('tablename')

    if (error) {
      console.error('❌ Error querying tables:', error.message)
      console.log('\n💡 Trying alternative method...\n')

      // Try alternative: query information_schema
      const result = await supabase.rpc('get_tables')

      if (result.error) {
        console.error('❌ Alternative method also failed')
        console.log('\nTrying to list known tables by querying them...\n')

        // List of tables we use in API routes
        const knownTables = [
          'meal_completions',
          'workout_sessions',
          'sleep_tracking',
          'testoup_tracking',
          'daily_progress_scores',
          'quiz_results_v2',
          'workout_exercise_sets',
          'testoup_inventory',
          'user_daily_completion',
          'user_programs',
          'users'
        ]

        console.log('📋 Testing known tables:\n')

        for (const table of knownTables) {
          try {
            const { error: testError } = await supabase
              .from(table)
              .select('*')
              .limit(0)

            if (testError) {
              console.log(`  ❌ ${table} - Does NOT exist`)
            } else {
              console.log(`  ✅ ${table} - EXISTS`)
            }
          } catch (e) {
            console.log(`  ❌ ${table} - Error checking`)
          }
        }
      }

      return
    }

    if (data && data.length > 0) {
      console.log('✅ Found tables in database:\n')
      data.forEach((row: any) => {
        console.log(`  - ${row.tablename}`)
      })
      console.log(`\n  Total: ${data.length} tables\n`)
    } else {
      console.log('⚠️  No tables found in public schema\n')
    }
  } catch (error: any) {
    console.error('❌ Failed:', error.message)
  }
}

checkTables()
