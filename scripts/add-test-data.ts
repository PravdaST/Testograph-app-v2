import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'
const testDate = '2025-11-18' // Monday

async function addTestData() {
  console.log(`\n📝 Adding test data for ${email} on ${testDate}\n`)

  // 1. Add meals (3+)
  for (let i = 1; i <= 4; i++) {
    const { error } = await supabase
      .from('meal_completions')
      .upsert({
        email,
        date: testDate,
        meal_number: i,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'email,date,meal_number',
        ignoreDuplicates: false
      })

    if (error) {
      console.error(`❌ Error adding meal ${i}:`, error)
    } else {
      console.log(`✅ Added meal ${i}`)
    }
  }

  // 2. Add workout
  const { error: workoutError } = await supabase
    .from('workout_sessions')
    .insert({
      email,
      date: testDate,
      day_of_week: 1, // Monday
      workout_name: 'Тестова тренировка',
      target_duration_minutes: 45,
      actual_duration_minutes: 45,
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      total_pause_duration_seconds: 0,
      status: 'completed'
    })

  if (workoutError) {
    console.error('❌ Error adding workout:', workoutError)
  } else {
    console.log('✅ Added workout')
  }

  // 3. Add sleep
  const { error: sleepError } = await supabase
    .from('sleep_tracking')
    .upsert({
      email,
      date: testDate,
      hours_slept: 7.5,
      quality_rating: 4,
      feeling: 'energetic',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'email,date'
    })

  if (sleepError) {
    console.error('❌ Error adding sleep:', sleepError)
  } else {
    console.log('✅ Added sleep')
  }

  // 4. Add TestoUp
  const { error: testoUpError } = await supabase
    .from('testoup_tracking')
    .upsert({
      email,
      date: testDate,
      morning_taken: true,
      evening_taken: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'email,date'
    })

  if (testoUpError) {
    console.error('❌ Error adding TestoUp:', testoUpError)
  } else {
    console.log('✅ Added TestoUp')
  }

  console.log('\n✅ Test data added! Now refresh the page to see the green day.\n')
}

addTestData().catch(console.error)
