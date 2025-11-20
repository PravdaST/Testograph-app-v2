import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'

async function checkUserData() {
  console.log('\n📊 Checking user data for:', email, '\n')

  try {
    // Check user_progress
    const { data: progress, error: progressError } = await (supabase
      .from('user_progress') as any)
      .select('*')
      .eq('email', email)
      .single()

    console.log('user_progress table:')
    if (progress) {
      console.log(JSON.stringify(progress, null, 2))
    } else {
      console.log('No data found or error:', progressError?.message)
    }

    console.log('\n' + '-'.repeat(80) + '\n')

    // Check quiz_results
    const { data: quiz, error: quizError } = await (supabase
      .from('quiz_results') as any)
      .select('*')
      .eq('email', email)
      .single()

    console.log('quiz_results table:')
    if (quiz) {
      console.log(JSON.stringify(quiz, null, 2))
    } else {
      console.log('No data found or error:', quizError?.message)
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

checkUserData()
