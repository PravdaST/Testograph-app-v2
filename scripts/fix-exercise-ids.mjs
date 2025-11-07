import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load exercises database
const exercisesPath = path.join(__dirname, '../../exercisedb-api-main/exercisedb-api-main/src/data/exercises.json')
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))

console.log(`\n📊 Loaded ${exercises.length} exercises from database\n`)

// All exercise names from our workouts (from mock-workouts-gym.ts and mock-workouts-home.ts)
const workoutExercises = [
  // GYM Workouts
  { name_en: 'bodyweight squat', name_bg: 'Клекове' },
  { name_en: 'dumbbell lunge', name_bg: 'Напади' },
  { name_en: 'barbell romanian deadlift', name_bg: 'Румънска мъртва тяга' },
  { name_en: 'air bike', name_bg: 'Jumping Jacks' },
  { name_en: 'push-up', name_bg: 'Лицеви опори' },
  { name_en: 'dumbbell bent over row', name_bg: 'Гребане' },
  { name_en: 'dumbbell shoulder press', name_bg: 'Overhead Press' },
  { name_en: 'dumbbell biceps curl', name_bg: 'Бицепс' },
  { name_en: 'dumbbell lying triceps extension', name_bg: 'Трицепс' },
  { name_en: 'burpee', name_bg: 'Burpees' },
  { name_en: 'plank', name_bg: 'Планк' },
  { name_en: 'mountain climber', name_bg: 'Mountain Climbers' },
  { name_en: 'barbell deadlift', name_bg: 'Deadlift' },

  // HOME Workouts additional
  { name_en: 'walking lunge', name_bg: 'Ходещи напади' },
  { name_en: 'single leg bridge with outstretched leg', name_bg: 'Глутеус мост' },
  { name_en: 'inverted row bent knees', name_bg: 'Обърнато гребане' },
  { name_en: 'decline push-up', name_bg: 'Наклонени лицеви опори' },
  { name_en: 'pull up (neutral grip)', name_bg: 'Набирания' },
  { name_en: 'diamond push-up', name_bg: 'Диамантени лицеви опори' },
]

console.log('🔍 EXACT MATCHING - Търсене на упражнения\n')
console.log('═'.repeat(100))

const results = []

for (const ex of workoutExercises) {
  console.log(`\n📋 ${ex.name_bg} → "${ex.name_en}"`)

  // Find EXACT match (case insensitive)
  const exactMatch = exercises.find(e =>
    e.name.toLowerCase() === ex.name_en.toLowerCase()
  )

  if (exactMatch) {
    const gifId = exactMatch.exerciseId
    console.log(`   ✅ EXACT MATCH: ${exactMatch.name}`)
    console.log(`      ID: ${gifId}`)
    console.log(`      GIF: https://static.exercisedb.dev/media/${gifId}.gif`)

    results.push({
      ...ex,
      exerciseId: gifId,
      fullName: exactMatch.name,
      found: true,
      matchType: 'exact'
    })
  } else {
    // Try partial match as fallback
    const partialMatches = exercises.filter(e => {
      const name = e.name.toLowerCase()
      const searchName = ex.name_en.toLowerCase()
      return name.includes(searchName) || searchName.includes(name)
    })

    if (partialMatches.length > 0) {
      console.log(`   ⚠️  No exact match. Found ${partialMatches.length} similar:`)
      partialMatches.slice(0, 5).forEach((match, i) => {
        console.log(`      ${i + 1}. ${match.name} (ID: ${match.exerciseId})`)
      })

      // Use first match
      const bestMatch = partialMatches[0]
      results.push({
        ...ex,
        exerciseId: bestMatch.exerciseId,
        fullName: bestMatch.name,
        found: true,
        matchType: 'partial',
        alternatives: partialMatches.length
      })
    } else {
      console.log(`   ❌ NOT FOUND`)
      results.push({ ...ex, found: false })
    }
  }
}

console.log('\n' + '═'.repeat(100))
console.log('\n📊 РЕЗУЛТАТ:\n')

const exactMatches = results.filter(r => r.matchType === 'exact')
const partialMatches = results.filter(r => r.matchType === 'partial')
const notFound = results.filter(r => !r.found)

console.log(`✅ Exact matches: ${exactMatches.length}/${results.length}`)
console.log(`⚠️  Partial matches: ${partialMatches.length}/${results.length}`)
console.log(`❌ Not found: ${notFound.length}/${results.length}`)

// Download GIF files
console.log('\n\n📥 Downloading GIF files from ExerciseDB CDN...\n')

const targetDir = path.join(__dirname, '../public/exercises')

let downloadedCount = 0
let failedCount = 0

for (const result of results.filter(r => r.found)) {
  const gifUrl = `https://static.exercisedb.dev/media/${result.exerciseId}.gif`
  const targetPath = path.join(targetDir, `${result.exerciseId}.gif`)

  try {
    console.log(`   ⬇️  Downloading ${result.exerciseId}.gif → ${result.name_bg}`)

    const response = await fetch(gifUrl)
    if (!response.ok) {
      console.log(`   ❌ Failed: HTTP ${response.status}`)
      failedCount++
      continue
    }

    const buffer = await response.arrayBuffer()
    fs.writeFileSync(targetPath, Buffer.from(buffer))

    console.log(`   ✅ Saved (${(buffer.byteLength / 1024).toFixed(1)} KB)`)
    downloadedCount++
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    failedCount++
  }
}

console.log(`\n✅ Downloaded: ${downloadedCount} GIF files`)
if (failedCount > 0) {
  console.log(`⚠️  Failed: ${failedCount} GIF files`)
}

// Generate mapping
console.log('\n\n📝 Exercise ID Mapping:\n')
console.log('// GYM Workouts')
results.filter(r => r.found).forEach(r => {
  const match = r.matchType === 'exact' ? '' : ' // ⚠️ Partial match'
  console.log(`{ name_en: '${r.name_en}', id: '${r.exerciseId}', name_bg: '${r.name_bg}' }${match}`)
})

console.log('\n' + '═'.repeat(100))
console.log('✨ ГОТОВО!\n')
