import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkWorkoutSchema() {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .limit(1)

  console.log('Workout schema:')
  if (error) {
    console.error('Error:', error)
  } else if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]))
    console.log('Sample data:', data[0])
  } else {
    console.log('No data in workout_sessions table')
  }
}

checkWorkoutSchema().catch(console.error)
