import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load exercises database
const exercisesPath = path.join(__dirname, '../lib/data/exercises.json')
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))

// HOME workout bodyweight alternatives needed
const homeExercises = [
  // Already bodyweight - keep same
  { current: 'bodyweight squat', type: 'keep', name_bg: 'Клекове' },
  { current: 'air bike', type: 'keep', name_bg: 'Jumping Jacks' },
  { current: 'push up', type: 'keep', name_bg: 'Лицеви опори' },
  { current: 'burpee', type: 'keep', name_bg: 'Burpees' },
  { current: 'plank', type: 'keep', name_bg: 'Планк' },
  { current: 'mountain climber', type: 'keep', name_bg: 'Mountain Climbers' },

  // Need bodyweight replacements
  { current: 'dumbbell lunge', search: ['bodyweight lunge', 'lunge'], name_bg: 'Напади' },
  { current: 'barbell romanian deadlift', search: ['single leg deadlift', 'bodyweight deadlift', 'good morning'], name_bg: 'Румънска мъртва тяга' },
  { current: 'bent over row', search: ['bodyweight row', 'inverted row', 'australian pull'], name_bg: 'Гребане' },
  { current: 'dumbbell shoulder press', search: ['pike push', 'handstand push', 'decline push'], name_bg: 'Overhead Press' },
  { current: 'dumbbell curl', search: ['chin up', 'pull up', 'bodyweight curl'], name_bg: 'Бицепс' },
  { current: 'dumbbell lying triceps extension', search: ['diamond push', 'close grip push', 'bench dip', 'tricep dip'], name_bg: 'Трицепс' },
  { current: 'barbell deadlift', search: ['single leg deadlift', 'bodyweight deadlift', 'good morning'], name_bg: 'Deadlift' },
]

console.log('\n🏠 HOME WORKOUT - Bodyweight Exercise Search\n')
console.log('═'.repeat(90))

const results = []

for (const ex of homeExercises) {
  if (ex.type === 'keep') {
    console.log(`\n✅ ${ex.name_bg} → "${ex.current}" (KEEP - already bodyweight)`)
    results.push({ ...ex, found: true, action: 'keep' })
    continue
  }

  console.log(`\n🔄 ${ex.name_bg} → replacing "${ex.current}"`)

  // Find bodyweight alternatives
  const matches = []
  for (const searchTerm of ex.search) {
    const found = exercises.filter(e => {
      const name = e.name.toLowerCase()
      const equipment = e.equipments.join(' ').toLowerCase()
      return name.includes(searchTerm.toLowerCase()) &&
             (equipment.includes('body weight') || equipment.includes('bodyweight'))
    })
    matches.push(...found)
  }

  // Remove duplicates
  const unique = [...new Map(matches.map(m => [m.exerciseId, m])).values()]

  if (unique.length === 0) {
    console.log(`   ❌ NO bodyweight alternatives found`)
    results.push({ ...ex, found: false })
  } else {
    console.log(`   ✅ Found ${unique.length} bodyweight alternatives:`)
    unique.slice(0, 3).forEach((match, i) => {
      const gifId = match.gifUrl.split('/').pop().replace('.gif', '')
      console.log(`      ${i + 1}. ${match.name} (ID: ${gifId})`)
    })

    const best = unique[0]
    const gifId = best.gifUrl.split('/').pop().replace('.gif', '')
    results.push({
      ...ex,
      found: true,
      exerciseId: gifId,
      name_en: best.name,
      action: 'replace',
      alternatives: unique.length
    })
  }
}

console.log('\n' + '═'.repeat(90))
console.log('\n📊 РЕЗУЛТАТ:\n')

const kept = results.filter(r => r.action === 'keep')
const replaced = results.filter(r => r.action === 'replace' && r.found)
const notFound = results.filter(r => !r.found)

console.log(`✅ Запазени bodyweight: ${kept.length}`)
console.log(`🔄 Заменени с bodyweight: ${replaced.length}`)
console.log(`❌ Не намерени: ${notFound.length}`)

// Copy GIFs for replaced exercises
console.log('\n\n📁 Копиране на GIF файлове за HOME workout...\n')

const sourceDir = path.join(__dirname, '../supabase/migrations/workouts')
const targetDir = path.join(__dirname, '../public/exercises')

let copiedCount = 0

for (const result of results.filter(r => r.action === 'replace' && r.found)) {
  const sourcePath = path.join(sourceDir, `${result.exerciseId}.gif`)
  const targetPath = path.join(targetDir, `${result.exerciseId}.gif`)

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath)
    console.log(`   ✅ ${result.exerciseId}.gif → ${result.name_bg} (${result.name_en})`)
    copiedCount++
  } else {
    console.log(`   ❌ ${result.exerciseId}.gif - НЕ СЪЩЕСТВУВА`)
  }
}

console.log(`\n✅ Копирани: ${copiedCount} нови GIF файла за HOME workout`)

// Generate HOME workout mapping
console.log('\n\n📝 HOME Workout Exercise Mapping:\n')
console.log('const HOME_EXERCISE_MAP = {')
results.filter(r => r.found).forEach(r => {
  const id = r.exerciseId || r.current
  console.log(`  '${r.current}': { id: '${id}', name_en: '${r.name_en || r.current}', name_bg: '${r.name_bg}' },`)
})
console.log('}')

console.log('\n' + '═'.repeat(90))
console.log('✨ ГОТОВО!\n')
