const email = 'caspere63@gmail.com'
const startDate = '2025-11-16'
const endDate = '2025-11-23'

const url = `http://localhost:3000/api/user/daily-completion?email=${encodeURIComponent(email)}&startDate=${startDate}&endDate=${endDate}`

async function testAPI() {
  console.log(`\n🌐 Testing API endpoint:\n${url}\n`)

  try {
    const response = await fetch(url)
    const data = await response.json()

    console.log('Response status:', response.status)
    console.log('\nCompletion status:')
    console.log(JSON.stringify(data.completionStatus, null, 2))

    // Check if 2025-11-18 is marked as complete
    if (data.completionStatus['2025-11-18'] === true) {
      console.log('\n✅ 2025-11-18 is correctly marked as COMPLETE!')
    } else {
      console.log('\n❌ 2025-11-18 is NOT marked as complete (BUG!)')
    }
  } catch (error) {
    console.error('Error calling API:', error)
  }
}

testAPI()
