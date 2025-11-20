import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'
const partialDate = '2025-11-17' // Tuesday - partial completion

async function addPartialDay() {
  console.log(`\n📝 Adding PARTIAL completion for ${email} on ${partialDate}`)
  console.log('   Adding only 2/4 tasks (meals + sleep)\n')

  // 1. Add meals (3+ = completed)
  for (let i = 1; i <= 4; i++) {
    const { error } = await supabase
      .from('meal_completions')
      .upsert({
        email,
        date: partialDate,
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

  // 2. Add sleep (no workout, no testoup)
  const { error: sleepError } = await supabase
    .from('sleep_tracking')
    .upsert({
      email,
      date: partialDate,
      hours_slept: 6.5,
      quality_rating: 3,
      feeling: 'tired',
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

  console.log('\n🟠 Partial day added (2/4 tasks)!')
  console.log('   ✅ Meals: completed')
  console.log('   ✅ Sleep: completed')
  console.log('   ❌ Workout: not completed')
  console.log('   ❌ TestoUp: not completed')
  console.log('\n   This day should appear ORANGE in the calendar.\n')
}

addPartialDay().catch(console.error)
