import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSleepSchema() {
  // Get any sleep record to see structure
  const { data, error } = await supabase
    .from('sleep_tracking')
    .select('*')
    .limit(1)

  console.log('Sleep tracking schema:')
  if (error) {
    console.error('Error:', error)
  } else if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]))
    console.log('Sample data:', data[0])
  } else {
    console.log('No data in sleep_tracking table')
  }

  // Also check if user has ANY data at all
  const email = 'caspere63@gmail.com'

  const { data: anyData, error: anyError } = await supabase
    .from('sleep_tracking')
    .select('*')
    .eq('email', email)
    .limit(5)

  console.log(`\nAll sleep records for ${email}:`)
  if (anyError) {
    console.error('Error:', anyError)
  } else {
    console.log('Count:', anyData?.length || 0)
    if (anyData && anyData.length > 0) {
      console.log('Records:', anyData)
    }
  }
}

checkSleepSchema().catch(console.error)
