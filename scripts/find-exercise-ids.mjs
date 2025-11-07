import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load exercises database
const exercisesPath = path.join(__dirname, '../lib/data/exercises.json')
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))

// Exercise names from our workouts (Bulgarian -> English)
const searchTerms = [
  { bg: 'Клекове', en: 'squat', keywords: ['bodyweight squat', 'squat'] },
  { bg: 'Лицеви опори', en: 'push-up', keywords: ['push-up', 'push up'] },
  { bg: 'Планк', en: 'plank', keywords: ['plank'] },
  { bg: 'Повдигане на коляно', en: 'high knees', keywords: ['high knee', 'knee'] },
  { bg: 'Burpees', en: 'burpee', keywords: ['burpee'] },
  { bg: 'Скачане на въже', en: 'jump rope', keywords: ['jump rope', 'rope'] },
  { bg: 'Jumping Jacks', en: 'jumping jacks', keywords: ['jumping jack'] },
  { bg: 'Mountain Climbers', en: 'mountain climbers', keywords: ['mountain climber'] },
  { bg: 'Издължаване', en: 'lunge', keywords: ['lunge', 'forward lunge'] },
  { bg: 'Руски обрат', en: 'russian twist', keywords: ['russian twist'] },
  { bg: 'Dead Bug', en: 'dead bug', keywords: ['dead bug'] },
  { bg: 'Bicycle Crunch', en: 'bicycle crunch', keywords: ['bicycle crunch'] },
  { bg: 'Bird Dog', en: 'bird dog', keywords: ['bird dog'] },
  { bg: 'Glute Bridge', en: 'glute bridge', keywords: ['glute bridge', 'bridge'] },
  { bg: 'Crunch', en: 'crunch', keywords: ['crunch', 'ab crunch'] },
  { bg: 'Dip на стол', en: 'chair dip', keywords: ['chair dip', 'bench dip', 'dip'] },
]

console.log('\n🔍 Търсене на упражнения в exercises.json\n')
console.log('═'.repeat(80))

const results = []

for (const term of searchTerms) {
  console.log(`\n📋 ${term.bg} (${term.en})`)

  // Search for matches
  const matches = exercises.filter(ex => {
    const name = ex.name.toLowerCase()
    return term.keywords.some(keyword => name.includes(keyword.toLowerCase()))
  })

  if (matches.length === 0) {
    console.log(`   ❌ НЕ е намерено`)
    results.push({ ...term, found: false, exerciseId: null, gifUrl: null })
  } else if (matches.length === 1) {
    const match = matches[0]
    const gifId = match.gifUrl.split('/').pop().replace('.gif', '')
    console.log(`   ✅ Намерено: ${match.name}`)
    console.log(`      ID: ${gifId}`)
    console.log(`      GIF: ${match.gifUrl}`)
    results.push({ ...term, found: true, exerciseId: gifId, fullName: match.name, gifUrl: match.gifUrl })
  } else {
    console.log(`   ⚠️  Намерени ${matches.length} съвпадения:`)
    matches.slice(0, 3).forEach((match, i) => {
      const gifId = match.gifUrl.split('/').pop().replace('.gif', '')
      console.log(`      ${i + 1}. ${match.name} (ID: ${gifId})`)
    })
    const match = matches[0] // Use first match
    const gifId = match.gifUrl.split('/').pop().replace('.gif', '')
    results.push({ ...term, found: true, exerciseId: gifId, fullName: match.name, gifUrl: match.gifUrl, multipleMatches: matches.length })
  }
}

console.log('\n' + '═'.repeat(80))
console.log('\n📊 РЕЗУЛТАТ:\n')

const found = results.filter(r => r.found)
console.log(`✅ Намерени: ${found.length}/${results.length}`)
console.log(`❌ Липсващи: ${results.filter(r => !r.found).length}/${results.length}`)

// Generate mapping object
console.log('\n\n📝 JavaScript Mapping Object:\n')
console.log('const exerciseIdMap = {')
results.filter(r => r.found).forEach(r => {
  console.log(`  '${r.en}': '${r.exerciseId}', // ${r.bg} - ${r.fullName}`)
})
console.log('}')

// Copy GIFs
console.log('\n\n📁 Копиране на GIF файлове...\n')

const sourceDir = path.join(__dirname, '../supabase/migrations/workouts')
const targetDir = path.join(__dirname, '../public/exercises')

let copiedCount = 0
let missingCount = 0

for (const result of results.filter(r => r.found)) {
  const sourcePath = path.join(sourceDir, `${result.exerciseId}.gif`)
  const targetPath = path.join(targetDir, `${result.exerciseId}.gif`)

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath)
    console.log(`   ✅ ${result.exerciseId}.gif → ${result.bg}`)
    copiedCount++
  } else {
    console.log(`   ❌ ${result.exerciseId}.gif - НЕ СЪЩЕСТВУВА в workouts папката`)
    missingCount++
  }
}

console.log(`\n✅ Копирани: ${copiedCount} GIF файла`)
if (missingCount > 0) {
  console.log(`⚠️  Липсващи: ${missingCount} GIF файла`)
}

console.log('\n' + '═'.repeat(80))
console.log('✨ ГОТОВО!\n')
