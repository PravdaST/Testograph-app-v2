import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get all workout files
const dataDir = path.join(__dirname, '..', 'lib', 'data')
const workoutFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('mock-workouts') && f.endsWith('.ts'))

// Collect all exercises with their details
const exercisesMap = new Map()

for (const file of workoutFiles) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')

  // Extract exercises using regex
  const exercisePattern = /{\s*exercisedb_id:\s*'([^']+)',\s*name_bg:\s*'([^']+)',\s*name_en:\s*'([^']+)'/g

  let match
  while ((match = exercisePattern.exec(content)) !== null) {
    const [, id, nameBg, nameEn] = match

    if (!exercisesMap.has(id)) {
      exercisesMap.set(id, { id, nameBg, nameEn })
    }
  }
}

// Sort exercises by Bulgarian name
const exercises = Array.from(exercisesMap.values()).sort((a, b) => a.nameBg.localeCompare(b.nameBg, 'bg'))

console.log(`\n📋 СПИСЪК НА ВСИЧКИ ${exercises.length} УПРАЖНЕНИЯ:\n`)
console.log('═'.repeat(80))

exercises.forEach((ex, index) => {
  console.log(`${(index + 1).toString().padStart(3)}. ${ex.nameBg}`)
  console.log(`     └─ EN: ${ex.nameEn}`)
  console.log(`     └─ ID: ${ex.id}`)
  console.log()
})

console.log('═'.repeat(80))
console.log(`\nОБЩО: ${exercises.length} уникални упражнения\n`)
