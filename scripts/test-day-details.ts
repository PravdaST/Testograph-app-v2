const email = 'caspere63@gmail.com'

const testDates = [
  '2025-11-16', // 0/4 - red
  '2025-11-17', // 2/4 - orange
  '2025-11-18', // 4/4 - green
]

async function testDayDetails() {
  for (const date of testDates) {
    const url = `http://localhost:3000/api/user/day-details?email=${encodeURIComponent(email)}&date=${date}`

    console.log(`\n📅 Testing ${date}:`)
    console.log('─'.repeat(50))

    try {
      const response = await fetch(url)
      const data = await response.json()

      console.log(`Overall: ${data.completedTasks}/${data.totalTasks} tasks`)
      console.log(`\n🍽️  Meals: ${data.tasks.meals.status} (${data.tasks.meals.completed}/${data.tasks.meals.total})`)
      if (data.tasks.meals.completedMealNumbers.length > 0) {
        console.log(`   Completed meals: ${data.tasks.meals.completedMealNumbers.join(', ')}`)
      }

      console.log(`\n🏋️  Workout: ${data.tasks.workout.status}`)
      if (data.tasks.workout.name) {
        console.log(`   Name: ${data.tasks.workout.name}`)
        console.log(`   Duration: ${data.tasks.workout.duration} min`)
      }

      console.log(`\n😴 Sleep: ${data.tasks.sleep.status}`)
      if (data.tasks.sleep.hours) {
        console.log(`   Hours: ${data.tasks.sleep.hours}h`)
        console.log(`   Quality: ${data.tasks.sleep.quality}/5`)
        console.log(`   Feeling: ${data.tasks.sleep.feeling}`)
      }

      console.log(`\n💊 TestoUp: ${data.tasks.testoup.status}`)
      console.log(`   Morning: ${data.tasks.testoup.morning ? '✅' : '❌'}`)
      console.log(`   Evening: ${data.tasks.testoup.evening ? '✅' : '❌'}`)

    } catch (error) {
      console.error('Error:', error)
    }
  }

  console.log('\n' + '═'.repeat(50) + '\n')
}

testDayDetails()
