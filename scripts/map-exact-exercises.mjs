import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load exercises database
const exercisesPath = path.join(__dirname, '../lib/data/exercises.json')
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))

// Exercise names from mock-workouts.ts
const workoutExercises = [
  { name_en: 'bodyweight squat', name_bg: 'Клекове' },
  { name_en: 'dumbbell lunge', name_bg: 'Напади' },
  { name_en: 'barbell romanian deadlift', name_bg: 'Румънска мъртва тяга' },
  { name_en: 'air bike', name_bg: 'Jumping Jacks' }, // This might need adjustment
  { name_en: 'push up', name_bg: 'Лицеви опори' },
  { name_en: 'bent over row', name_bg: 'Гребане с дъмбели' },
  { name_en: 'dumbbell shoulder press', name_bg: 'Overhead Press' },
  { name_en: 'dumbbell curl', name_bg: 'Бицепс къдрене' },
  { name_en: 'dumbbell lying triceps extension', name_bg: 'Трицепс extension' },
  { name_en: 'yoga downward facing dog', name_bg: 'Downward Dog' },
  { name_en: 'child pose', name_bg: 'Child Pose' },
  { name_en: 'cobra stretch', name_bg: 'Cobra Stretch' },
  { name_en: 'burpee', name_bg: 'Burpees' },
  { name_en: 'plank', name_bg: 'Планк' },
  { name_en: 'mountain climber', name_bg: 'Mountain Climbers' },
  { name_en: 'barbell deadlift', name_bg: 'Deadlift' },
  { name_en: 'walking', name_bg: 'Разходка' },
  { name_en: 'stretching', name_bg: 'Леко разтягане' },
]

console.log('\n🔍 Търсене на EXACT MATCHES в exercises.json\n')
console.log('═'.repeat(90))

const results = []
const sourceDir = path.join(__dirname, '../supabase/migrations/workouts')
const targetDir = path.join(__dirname, '../public/exercises')

for (const ex of workoutExercises) {
  console.log(`\n📋 ${ex.name_bg} → "${ex.name_en}"`)

  // Find exact match
  const exactMatch = exercises.find(e => e.name.toLowerCase() === ex.name_en.toLowerCase())

  if (exactMatch) {
    const gifId = exactMatch.gifUrl.split('/').pop().replace('.gif', '')
    console.log(`   ✅ EXACT: ${exactMatch.name}`)
    console.log(`      ID: ${gifId}`)

    // Check if GIF exists
    const sourcePath = path.join(sourceDir, `${gifId}.gif`)
    const targetPath = path.join(targetDir, `${gifId}.gif`)

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`      📁 GIF copied: ${gifId}.gif`)
      results.push({ ...ex, exerciseId: gifId, found: true, gifExists: true })
    } else {
      console.log(`      ❌ GIF NOT FOUND: ${gifId}.gif`)
      results.push({ ...ex, exerciseId: gifId, found: true, gifExists: false })
    }
  } else {
    // Try partial match
    const partialMatches = exercises.filter(e => {
      const name = e.name.toLowerCase()
      const searchTerms = ex.name_en.toLowerCase().split(' ')
      return searchTerms.every(term => name.includes(term))
    })

    if (partialMatches.length > 0) {
      console.log(`   ⚠️  No exact match, found ${partialMatches.length} similar:`)
      partialMatches.slice(0, 3).forEach((match, i) => {
        const gifId = match.gifUrl.split('/').pop().replace('.gif', '')
        console.log(`      ${i + 1}. ${match.name} (ID: ${gifId})`)
      })

      const match = partialMatches[0]
      const gifId = match.gifUrl.split('/').pop().replace('.gif', '')
      const sourcePath = path.join(sourceDir, `${gifId}.gif`)
      const targetPath = path.join(targetDir, `${gifId}.gif`)

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath)
        console.log(`      📁 Using first match, GIF copied: ${gifId}.gif`)
        results.push({ ...ex, exerciseId: gifId, found: true, gifExists: true, partial: true })
      } else {
        console.log(`      ❌ GIF NOT FOUND: ${gifId}.gif`)
        results.push({ ...ex, exerciseId: gifId, found: true, gifExists: false, partial: true })
      }
    } else {
      console.log(`   ❌ NOT FOUND`)
      results.push({ ...ex, found: false })
    }
  }
}

console.log('\n' + '═'.repeat(90))
console.log('\n📊 РЕЗУЛТАТ:\n')

const foundWithGif = results.filter(r => r.found && r.gifExists)
const foundNoGif = results.filter(r => r.found && !r.gifExists)
const notFound = results.filter(r => !r.found)

console.log(`✅ Намерени с GIF: ${foundWithGif.length}/${results.length}`)
console.log(`⚠️  Намерени БЕЗ GIF: ${foundNoGif.length}/${results.length}`)
console.log(`❌ НЕ намерени: ${notFound.length}/${results.length}`)

// Generate update commands for mock-workouts.ts
console.log('\n\n📝 IDs за обновяване в mock-workouts.ts:\n')
console.log('const exerciseIdMap = {')
results.filter(r => r.found).forEach(r => {
  console.log(`  '${r.name_en}': '${r.exerciseId}', // ${r.name_bg}${r.partial ? ' (partial match)' : ''}`)
})
console.log('}')

console.log('\n' + '═'.repeat(90))
console.log('✨ ГОТОВО!\n')
