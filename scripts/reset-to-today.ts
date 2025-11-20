import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'
const now = new Date().toISOString()

async function resetToToday() {
  console.log('\n🔄 Resetting program start to TODAY for:', email)
  console.log('📅 New start time:', now)
  console.log('=' .repeat(80) + '\n')

  try {
    // Update quiz_results_v2 created_at to today
    console.log('1️⃣  Updating quiz result timestamp...')

    const response = await fetch(`${supabaseUrl}/rest/v1/quiz_results_v2?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        created_at: now,
        completed_at: now
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Quiz timestamp updated!')
      console.log(`   Updated ${data.length} record(s)\n`)
    } else {
      console.log('⚠️  Status:', response.status)
      const error = await response.text()
      console.log('   Response:', error, '\n')
    }

    // Verify
    console.log('2️⃣  Verifying data...\n')
    const { data: quiz } = await (supabase
      .from('quiz_results_v2') as any)
      .select('email, first_name, category, determined_level, total_score, created_at, completed_at')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (quiz) {
      console.log('✅ Current quiz data:')
      console.log('   Email:', quiz.email)
      console.log('   Name:', quiz.first_name)
      console.log('   Category:', quiz.category)
      console.log('   Level:', quiz.determined_level)
      console.log('   Score:', quiz.total_score)
      console.log('   Created:', quiz.created_at)
      console.log('   Completed:', quiz.completed_at)
    }

    console.log('\n' + '='.repeat(80))
    console.log('🎉 SUCCESS! User now starts fresh from TODAY.')
    console.log('   Program start date:', now.split('T')[0])
    console.log('=' .repeat(80) + '\n')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

resetToToday()
