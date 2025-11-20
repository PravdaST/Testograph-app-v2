import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'
const today = new Date().toISOString().split('T')[0]

async function resetProgress() {
  console.log('\n🔄 Resetting progress for:', email)
  console.log('📅 Setting start date to:', today)
  console.log('=' .repeat(80) + '\n')

  try {
    // Update user_progress table (not user_programs!)
    console.log('📅 Updating program start date...')

    const response = await fetch(`${supabaseUrl}/rest/v1/user_progress?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        program_start_date: today
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Program start date updated!')
      console.log('   New start date:', today, '\n')
    } else {
      console.log('⚠️  Status:', response.status)
      const error = await response.text()
      console.log('   Error:', error, '\n')
    }

    // Verify
    console.log('📊 Fetching updated data...\n')
    const { data: progress } = await (supabase
      .from('user_progress') as any)
      .select('*')
      .eq('email', email)
      .single()

    if (progress) {
      console.log('✅ Current user progress:')
      console.log('   Email:', progress.email)
      console.log('   Program Start:', progress.program_start_date)
      console.log('   Category:', progress.category)
      console.log('   Level:', progress.level)
      console.log('   Quiz Score:', progress.total_score)
    }

    console.log('\n' + '='.repeat(80))
    console.log('🎉 Reset complete! User starts fresh from today.')
    console.log('=' .repeat(80) + '\n')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

resetProgress()
