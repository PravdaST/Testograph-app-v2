import exercisesData from './exercises.json'

export interface Exercise {
  exerciseId: string
  name: string
  gifUrl: string
  targetMuscles: string[]
  bodyParts: string[]
  equipments: string[]
  secondaryMuscles: string[]
  instructions: string[]
}

// Load all exercises
export const exercises: Exercise[] = exercisesData as Exercise[]

/**
 * Search for an exercise by name (case-insensitive, partial match)
 */
export function searchExerciseByName(query: string): Exercise | null {
  const lowerQuery = query.toLowerCase().trim()

  // First try exact match
  const exactMatch = exercises.find(ex => ex.name.toLowerCase() === lowerQuery)
  if (exactMatch) return exactMatch

  // Then try partial match (contains)
  const partialMatch = exercises.find(ex => ex.name.toLowerCase().includes(lowerQuery))
  return partialMatch || null
}

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): Exercise | null {
  return exercises.find(ex => ex.exerciseId === id) || null
}

/**
 * Get local GIF URL for an exercise
 */
export function getExerciseGifUrl(exerciseId: string): string {
  return `/exercises/${exerciseId}.gif`
}

/**
 * Search for exercises by equipment
 */
export function searchExercisesByEquipment(equipment: string): Exercise[] {
  const lowerEquipment = equipment.toLowerCase()
  return exercises.filter(ex =>
    ex.equipments.some(eq => eq.toLowerCase().includes(lowerEquipment))
  )
}

/**
 * Search for exercises by body part
 */
export function searchExercisesByBodyPart(bodyPart: string): Exercise[] {
  const lowerBodyPart = bodyPart.toLowerCase()
  return exercises.filter(ex =>
    ex.bodyParts.some(bp => bp.toLowerCase().includes(lowerBodyPart))
  )
}

/**
 * Quick search helper - returns exerciseId or throws error if not found
 */
export function findExerciseId(searchQuery: string): string {
  const exercise = searchExerciseByName(searchQuery)
  if (!exercise) {
    throw new Error(`Exercise not found: "${searchQuery}". Please check exercises.json`)
  }
  return exercise.exerciseId
}

/**
 * Batch search for multiple exercises
 */
export function findMultipleExerciseIds(queries: string[]): Record<string, string> {
  const result: Record<string, string> = {}

  for (const query of queries) {
    try {
      result[query] = findExerciseId(query)
    } catch (error) {
      console.warn(`Could not find exercise: ${query}`)
      result[query] = 'NOT_FOUND'
    }
  }

  return result
}

/**
 * Check if exercise is bodyweight (no equipment needed)
 * Returns true for exercises where weight input doesn't make sense
 */
export function isBodyweightExercise(exerciseId: string): boolean {
  const exercise = getExerciseById(exerciseId)
  if (!exercise) return false

  // Check if equipment is "body weight" or similar
  const bodyweightEquipments = ['body weight', 'assisted', 'leverage machine']
  return exercise.equipments.some(eq =>
    bodyweightEquipments.includes(eq.toLowerCase())
  )
}

/**
 * Check if exercise requires weight tracking
 * Returns true for exercises that use external weights (dumbbells, barbells, etc.)
 */
export function requiresWeightInput(exerciseId: string): boolean {
  const exercise = getExerciseById(exerciseId)
  if (!exercise) return true // Default to showing weight input

  // Equipments that require weight tracking
  const weightEquipments = ['barbell', 'dumbbell', 'kettlebell', 'ez barbell', 'olympic barbell', 'trap bar', 'weighted']

  return exercise.equipments.some(eq =>
    weightEquipments.some(we => eq.toLowerCase().includes(we))
  )
}
