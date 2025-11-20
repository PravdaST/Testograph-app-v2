import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'
const today = new Date().toISOString().split('T')[0]

async function updateProgramStart() {
  console.log('\n📅 Updating program start date to:', today, '\n')

  try {
    // Try to update using RPC or direct query
    const response = await fetch(`${supabaseUrl}/rest/v1/user_programs?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        program_start_date: today,
        updated_at: new Date().toISOString()
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Program start date updated successfully!')
      console.log('Updated record:', data)
    } else {
      const error = await response.text()
      console.log('⚠️  Could not update via REST API')
      console.log('Status:', response.status)
      console.log('Error:', error)
    }

    // Verify current data
    console.log('\n📊 Fetching current user program data...\n')
    const { data: program, error: fetchError } = await (supabase
      .from('user_programs') as any)
      .select('*')
      .eq('email', email)
      .single()

    if (program) {
      console.log('Current program data:')
      console.log('  Email:', program.email)
      console.log('  Start Date:', program.program_start_date)
      console.log('  Category:', program.category)
      console.log('  Level:', program.level)
      console.log('  Initial Score:', program.total_score)
    } else if (fetchError) {
      console.log('⚠️  Error fetching program:', fetchError.message)
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

updateProgramStart()
