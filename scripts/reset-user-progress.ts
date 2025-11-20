import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mrpsaqtmucxpawajfxfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'

const supabase = createClient(supabaseUrl, supabaseKey)
const email = 'caspere63@gmail.com'
const today = new Date().toISOString().split('T')[0]

async function resetUserProgress() {
  console.log('\n🔄 Resetting user progress for:', email)
  console.log('📅 New start date:', today)
  console.log('=' .repeat(80) + '\n')

  try {
    // 1. Update program start date to today
    console.log('1️⃣  Updating program start date...')
    const { error: programError } = await (supabase
      .from('user_programs') as any)
      .update({
        program_start_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)

    if (programError) {
      console.error('❌ Error updating program:', programError.message)
    } else {
      console.log('✅ Program start date updated to:', today, '\n')
    }

    // 2. Delete all meal completions
    console.log('2️⃣  Deleting meal completions...')
    const { error: mealsError, count: mealsCount } = await (supabase
      .from('meal_completions') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (mealsError) {
      console.error('❌ Error deleting meals:', mealsError.message)
    } else {
      console.log(`✅ Deleted ${mealsCount || 0} meal completions\n`)
    }

    // 3. Delete all workout sessions
    console.log('3️⃣  Deleting workout sessions...')
    const { error: workoutsError, count: workoutsCount } = await (supabase
      .from('workout_sessions') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (workoutsError) {
      console.error('❌ Error deleting workouts:', workoutsError.message)
    } else {
      console.log(`✅ Deleted ${workoutsCount || 0} workout sessions\n`)
    }

    // 4. Delete all sleep tracking
    console.log('4️⃣  Deleting sleep tracking...')
    const { error: sleepError, count: sleepCount } = await (supabase
      .from('sleep_tracking') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (sleepError) {
      console.error('❌ Error deleting sleep:', sleepError.message)
    } else {
      console.log(`✅ Deleted ${sleepCount || 0} sleep records\n`)
    }

    // 5. Delete all TestoUp tracking
    console.log('5️⃣  Deleting TestoUp tracking...')
    const { error: testoupError, count: testoupCount } = await (supabase
      .from('testoup_tracking') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (testoupError) {
      console.error('❌ Error deleting testoup:', testoupError.message)
    } else {
      console.log(`✅ Deleted ${testoupCount || 0} TestoUp records\n`)
    }

    // 6. Delete daily completion records
    console.log('6️⃣  Deleting daily completion records...')
    const { error: completionError, count: completionCount } = await (supabase
      .from('user_daily_completion') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (completionError) {
      console.error('❌ Error deleting completions:', completionError.message)
    } else {
      console.log(`✅ Deleted ${completionCount || 0} completion records\n`)
    }

    // 7. Delete daily progress scores
    console.log('7️⃣  Deleting daily progress scores...')
    const { error: scoresError, count: scoresCount } = await (supabase
      .from('daily_progress_scores') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (scoresError) {
      console.error('❌ Error deleting scores:', scoresError.message)
    } else {
      console.log(`✅ Deleted ${scoresCount || 0} progress scores\n`)
    }

    // 8. Delete exercise progress
    console.log('8️⃣  Deleting exercise progress...')
    const { error: exerciseError, count: exerciseCount } = await (supabase
      .from('exercise_progress') as any)
      .delete({ count: 'exact' })
      .eq('email', email)

    if (exerciseError) {
      console.error('❌ Error deleting exercise progress:', exerciseError.message)
    } else {
      console.log(`✅ Deleted ${exerciseCount || 0} exercise progress records\n`)
    }

    console.log('=' .repeat(80))
    console.log('🎉 User progress reset complete!')
    console.log('=' .repeat(80))
    console.log('\n📊 Summary:')
    console.log(`   • Program start date: ${today}`)
    console.log(`   • Meal completions deleted: ${mealsCount || 0}`)
    console.log(`   • Workout sessions deleted: ${workoutsCount || 0}`)
    console.log(`   • Sleep records deleted: ${sleepCount || 0}`)
    console.log(`   • TestoUp records deleted: ${testoupCount || 0}`)
    console.log(`   • Completion records deleted: ${completionCount || 0}`)
    console.log(`   • Progress scores deleted: ${scoresCount || 0}`)
    console.log(`   • Exercise progress deleted: ${exerciseCount || 0}`)
    console.log('\n✅ User can now start fresh from today!\n')

  } catch (error: any) {
    console.error('\n❌ Error resetting progress:', error.message)
  }
}

resetUserProgress()
