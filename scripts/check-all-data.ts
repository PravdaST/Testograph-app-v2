import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'

async function checkAllData() {
  console.log(`\n🔍 All data for ${email}\n`)

  // Meals
  const { data: meals } = await supabase
    .from('meal_completions')
    .select('date, meal_number')
    .eq('email', email)
    .order('date', { ascending: false })
    .limit(20)

  console.log(`🍽️  Meals (last 20):`)
  if (meals && meals.length > 0) {
    const byDate = meals.reduce((acc: any, m) => {
      if (!acc[m.date]) acc[m.date] = []
      acc[m.date].push(m.meal_number)
      return acc
    }, {})
    Object.entries(byDate).forEach(([date, nums]) => {
      console.log(`   ${date}: ${(nums as number[]).length} meals - ${(nums as number[]).join(', ')}`)
    })
  } else {
    console.log('   No meal data')
  }

  // Workouts
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select('date, finished_at')
    .eq('email', email)
    .not('finished_at', 'is', null)
    .order('date', { ascending: false })
    .limit(10)

  console.log(`\n🏋️  Workouts (last 10 completed):`)
  if (workouts && workouts.length > 0) {
    workouts.forEach(w => {
      console.log(`   ${w.date} - Finished at ${w.finished_at}`)
    })
  } else {
    console.log('   No workout data')
  }

  // Sleep
  const { data: sleep } = await supabase
    .from('sleep_tracking')
    .select('date, hours_slept, quality_rating')
    .eq('email', email)
    .order('date', { ascending: false })
    .limit(10)

  console.log(`\n😴 Sleep (last 10):`)
  if (sleep && sleep.length > 0) {
    sleep.forEach(s => {
      console.log(`   ${s.date} - ${s.hours_slept}h (quality: ${s.quality_rating}/5)`)
    })
  } else {
    console.log('   No sleep data')
  }

  // TestoUp
  const { data: testoup } = await supabase
    .from('testoup_tracking')
    .select('date, morning_taken, evening_taken')
    .eq('email', email)
    .order('date', { ascending: false })
    .limit(10)

  console.log(`\n💊 TestoUp (last 10):`)
  if (testoup && testoup.length > 0) {
    testoup.forEach(t => {
      const morning = t.morning_taken ? '✅' : '❌'
      const evening = t.evening_taken ? '✅' : '❌'
      console.log(`   ${t.date} - Morning: ${morning} | Evening: ${evening}`)
    })
  } else {
    console.log('   No TestoUp data')
  }

  console.log('\n' + '═'.repeat(50) + '\n')
}

checkAllData().catch(console.error)
