import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

// Get all workout files
const workoutFiles = [
  'lib/data/mock-workouts-energy-low-home.ts',
  'lib/data/mock-workouts-energy-low-gym.ts',
  'lib/data/mock-workouts-energy-normal-home.ts',
  'lib/data/mock-workouts-energy-normal-gym.ts',
  'lib/data/mock-workouts-energy-high-home.ts',
  'lib/data/mock-workouts-energy-high-gym.ts',
  'lib/data/mock-workouts-libido-low-home.ts',
  'lib/data/mock-workouts-libido-low-gym.ts',
  'lib/data/mock-workouts-libido-normal-home.ts',
  'lib/data/mock-workouts-libido-normal-gym.ts',
  'lib/data/mock-workouts-libido-high-home.ts',
  'lib/data/mock-workouts-libido-high-gym.ts',
  'lib/data/mock-workouts-muscle-low-home.ts',
  'lib/data/mock-workouts-muscle-low-gym.ts',
  'lib/data/mock-workouts-muscle-normal-home.ts',
  'lib/data/mock-workouts-muscle-normal-gym.ts',
  'lib/data/mock-workouts-muscle-high-home.ts',
  'lib/data/mock-workouts-muscle-high-gym.ts',
]

// Extract all exercisedb_ids from workout files
const allExerciseIds = new Set()
const exerciseIdToNames = new Map()

for (const file of workoutFiles) {
  const filePath = path.join(projectRoot, file)
  const content = fs.readFileSync(filePath, 'utf-8')

  // Extract exercisedb_id values using regex
  const idMatches = content.matchAll(/exercisedb_id:\s*['"]([^'"]+)['"]/g)

  for (const match of idMatches) {
    const id = match[1]
    allExerciseIds.add(id)

    // Try to extract the name_bg for this exercise
    const nameMatch = content.match(new RegExp(`exercisedb_id:\\s*['"]${id}['"].*?name_bg:\\s*['"]([^'"]+)['"]`, 's'))
    if (nameMatch) {
      exerciseIdToNames.set(id, nameMatch[1])
    }
  }
}

console.log(`\n📊 Total unique exercises found: ${allExerciseIds.size}\n`)

// Get all GIF files in public/exercises
const exercisesDir = path.join(projectRoot, 'public', 'exercises')
const gifFiles = fs.readdirSync(exercisesDir)
  .filter(f => f.endsWith('.gif'))
  .map(f => f.replace('.gif', ''))

console.log(`📁 Total GIF files found: ${gifFiles.length}\n`)

// Find missing GIFs
const missingGifs = []
const hasGifs = []

for (const id of allExerciseIds) {
  const gifPath = path.join(exercisesDir, `${id}.gif`)

  if (fs.existsSync(gifPath)) {
    hasGifs.push(id)
  } else {
    missingGifs.push(id)
  }
}

console.log(`✅ Exercises with GIFs: ${hasGifs.length}`)
console.log(`❌ Missing GIFs: ${missingGifs.length}\n`)

if (missingGifs.length > 0) {
  console.log('🔴 Exercises missing GIF animations:\n')

  for (const id of missingGifs) {
    const name = exerciseIdToNames.get(id) || 'Unknown'
    console.log(`  • ${id} - ${name}`)
  }
}

console.log('\n✅ Summary:')
console.log(`  - ${hasGifs.length}/${allExerciseIds.size} exercises have GIFs (${Math.round(hasGifs.length / allExerciseIds.size * 100)}%)`)
console.log(`  - ${missingGifs.length}/${allExerciseIds.size} exercises missing GIFs (${Math.round(missingGifs.length / allExerciseIds.size * 100)}%)`)
