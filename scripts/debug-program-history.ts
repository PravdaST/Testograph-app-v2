import { createServiceClient } from '../lib/supabase/server'

async function debugProgramHistory() {
  const supabase = createServiceClient()

  // Get quiz email from localStorage (you'll need to provide it)
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Please provide email as argument: npx tsx scripts/debug-program-history.ts your@email.com')
    process.exit(1)
  }

  console.log(`\n🔍 Checking Program History for: ${email}\n`)

  // Fetch all quiz_results_v2 records
  const { data: programs, error } = await (supabase
    .from('quiz_results_v2') as any)
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching programs:', error)
    return
  }

  console.log(`📊 Total programs found: ${programs?.length || 0}\n`)

  programs?.forEach((program: any, index: number) => {
    console.log(`\n=== Program #${index + 1} ===`)
    console.log(`ID: ${program.id}`)
    console.log(`Category: ${program.category}`)
    console.log(`Level: ${program.level}`)
    console.log(`Total Score: ${program.total_score}`)
    console.log(`Workout Location: ${program.workout_location}`)
    console.log(`Dietary Preference: ${program.dietary_preference}`)
    console.log(`Completed At: ${program.completed_at}`)
    console.log(`Created At: ${program.created_at}`)
    console.log(`Program Start Date: ${program.program_start_date}`)
    console.log(`Program End Date: ${program.program_end_date}`)
    console.log(`---`)
  })

  console.log('\n✅ Debug complete\n')
}

debugProgramHistory()
