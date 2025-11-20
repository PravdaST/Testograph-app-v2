import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)

const email = 'caspere63@gmail.com'
const testDates = ['2025-11-16', '2025-11-17', '2025-11-18', '2025-11-19', '2025-11-20']

async function checkCompletion() {
  console.log(`\n🔍 Checking completion for ${email}\n`)

  for (const date of testDates) {
    console.log(`\n📅 Date: ${date}`)
    console.log('─'.repeat(50))

    // Check meals
    const { data: meals, error: mealsError } = await supabase
      .from('meal_completions')
      .select('meal_number')
      .eq('email', email)
      .eq('date', date)

    if (mealsError) {
      console.error('❌ Meals error:', mealsError)
    } else {
      const mealsCount = meals?.length || 0
      const mealsCompleted = mealsCount >= 3
      console.log(`🍽️  Meals: ${mealsCount}/5 (${mealsCompleted ? '✅' : '❌'} need 3+)`)
      if (meals && meals.length > 0) {
        console.log('   Meal numbers:', meals.map(m => m.meal_number).join(', '))
      }
    }

    // Check workout
    const { data: workout, error: workoutError } = await supabase
      .from('workout_sessions')
      .select('id, finished_at')
      .eq('email', email)
      .eq('date', date)
      .not('finished_at', 'is', null)
      .maybeSingle()

    if (workoutError) {
      console.error('❌ Workout error:', workoutError)
    } else {
      const workoutCompleted = !!workout
      console.log(`🏋️  Workout: ${workoutCompleted ? '✅ Completed' : '❌ Not completed'}`)
      if (workout) {
        console.log('   Finished at:', workout.finished_at)
      }
    }

    // Check sleep
    const { data: sleep, error: sleepError } = await supabase
      .from('sleep_tracking')
      .select('id, hours_slept')
      .eq('email', email)
      .eq('date', date)
      .maybeSingle()

    if (sleepError) {
      console.error('❌ Sleep error:', sleepError)
    } else {
      const sleepCompleted = !!sleep
      console.log(`😴 Sleep: ${sleepCompleted ? '✅ Tracked' : '❌ Not tracked'}`)
      if (sleep) {
        console.log('   Hours:', sleep.hours_slept)
      }
    }

    // Check TestoUp
    const { data: testoup, error: testoupError } = await supabase
      .from('testoup_tracking')
      .select('morning_taken, evening_taken')
      .eq('email', email)
      .eq('date', date)
      .maybeSingle()

    if (testoupError) {
      console.error('❌ TestoUp error:', testoupError)
    } else {
      const testoUpCompleted = !!(testoup?.morning_taken && testoup?.evening_taken)
      console.log(`💊 TestoUp: ${testoUpCompleted ? '✅ Both doses' : '❌ Missing doses'}`)
      if (testoup) {
        console.log(`   Morning: ${testoup.morning_taken ? '✅' : '❌'} | Evening: ${testoup.evening_taken ? '✅' : '❌'}`)
      }
    }

    // Overall
    const mealsOk = (meals?.length || 0) >= 3
    const workoutOk = !!workout
    const sleepOk = !!sleep
    const testoupOk = !!(testoup?.morning_taken && testoup?.evening_taken)
    const allComplete = mealsOk && workoutOk && sleepOk && testoupOk

    console.log(`\n${allComplete ? '✅ DAY COMPLETE' : '❌ DAY INCOMPLETE'}`)
  }

  console.log('\n' + '═'.repeat(50) + '\n')
}

checkCompletion().catch(console.error)
