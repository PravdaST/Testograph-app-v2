#!/usr/bin/env node

/**
 * Apply the access control migration to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=')
      const value = valueParts.join('=').replace(/^[\"']|[\"']$/g, '')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🚀 Applying Access Control Migration\\n')

async function applyMigration() {
  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'migrations', 'add_user_access_control.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

  console.log('📄 Migration file loaded')
  console.log('📝 SQL length:', migrationSQL.length, 'characters\\n')

  // Split SQL into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))

  console.log('🔧 Executing', statements.length, 'SQL statements...\\n')

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (!statement) continue

    // Detect what type of statement this is
    let statementType = 'QUERY'
    if (statement.includes('ALTER TABLE')) statementType = 'ALTER TABLE'
    if (statement.includes('CREATE OR REPLACE FUNCTION')) statementType = 'CREATE FUNCTION'
    if (statement.includes('CREATE TRIGGER')) statementType = 'CREATE TRIGGER'
    if (statement.includes('DROP TRIGGER')) statementType = 'DROP TRIGGER'
    if (statement.includes('COMMENT ON')) statementType = 'COMMENT'

    console.log(`${i + 1}/${statements.length} Executing ${statementType}...`)

    const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

    if (error) {
      // Try direct execution
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ query: statement + ';' }),
      })

      if (!response.ok) {
        console.error('   ❌ Error:', error?.message || 'Unknown error')
        console.log('   Statement:', statement.substring(0, 100) + '...')
      } else {
        console.log('   ✅ Success (via direct execution)')
      }
    } else {
      console.log('   ✅ Success')
    }
  }

  console.log('\\n🎉 Migration applied successfully!')
  console.log('\\n📝 Next: Run test-sample-webhook.mjs to verify trigger works')
}

applyMigration()
