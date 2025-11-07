/**
 * ExerciseDB API Service
 * Integration with RapidAPI ExerciseDB for workout videos and instructions
 */

interface ExerciseDBExercise {
  id: string
  name: string
  bodyPart: string
  equipment: string
  gifUrl: string
  target: string
  secondaryMuscles: string[]
  instructions: string[]
}

interface ExerciseSearchParams {
  search?: string
  bodyPart?: string
  equipment?: string
  target?: string
  limit?: number
  offset?: number
}

/**
 * Base fetch function for ExerciseDB API
 */
async function fetchExerciseDB(endpoint: string): Promise<unknown> {
  const apiKey = process.env.EXERCISEDB_API_KEY
  const apiHost = process.env.EXERCISEDB_API_HOST

  if (!apiKey || !apiHost) {
    throw new Error('ExerciseDB API credentials not configured')
  }

  const url = `https://${apiHost}${endpoint}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': apiHost,
    },
    next: {
      revalidate: 86400, // Cache for 24 hours
    },
  })

  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Search exercises by query
 */
export async function searchExercises(
  query: string,
  limit: number = 20
): Promise<ExerciseDBExercise[]> {
  const endpoint = `/api/v1/exercises/search?search=${encodeURIComponent(query)}&limit=${limit}`
  return fetchExerciseDB(endpoint) as Promise<ExerciseDBExercise[]>
}

/**
 * Get exercise by ID
 */
export async function getExerciseById(id: string): Promise<ExerciseDBExercise> {
  const endpoint = `/api/v1/exercises/${id}`
  return fetchExerciseDB(endpoint) as Promise<ExerciseDBExercise>
}

/**
 * Get exercises by body part
 */
export async function getExercisesByBodyPart(
  bodyPart: string,
  limit: number = 20
): Promise<ExerciseDBExercise[]> {
  const endpoint = `/api/v1/exercises/bodypart/${encodeURIComponent(bodyPart)}?limit=${limit}`
  return fetchExerciseDB(endpoint) as Promise<ExerciseDBExercise[]>
}

/**
 * Get exercises by equipment
 */
export async function getExercisesByEquipment(
  equipment: string,
  limit: number = 20
): Promise<ExerciseDBExercise[]> {
  const endpoint = `/api/v1/exercises/equipment/${encodeURIComponent(equipment)}?limit=${limit}`
  return fetchExerciseDB(endpoint) as Promise<ExerciseDBExercise[]>
}

/**
 * Get exercises by target muscle
 */
export async function getExercisesByTarget(
  target: string,
  limit: number = 20
): Promise<ExerciseDBExercise[]> {
  const endpoint = `/api/v1/exercises/target/${encodeURIComponent(target)}?limit=${limit}`
  return fetchExerciseDB(endpoint) as Promise<ExerciseDBExercise[]>
}

/**
 * Get list of all body parts
 */
export async function getBodyPartsList(): Promise<string[]> {
  const endpoint = '/api/v1/exercises/bodyparts'
  return fetchExerciseDB(endpoint) as Promise<string[]>
}

/**
 * Get list of all equipment types
 */
export async function getEquipmentList(): Promise<string[]> {
  const endpoint = '/api/v1/exercises/equipments'
  return fetchExerciseDB(endpoint) as Promise<string[]>
}

/**
 * Get list of all target muscles
 */
export async function getTargetMusclesList(): Promise<string[]> {
  const endpoint = '/api/v1/exercises/targets'
  return fetchExerciseDB(endpoint) as Promise<string[]>
}

/**
 * Map Bulgarian exercise names to English for API search
 * This will be used when searching for exercises from our database
 */
const exerciseNameMap: Record<string, string> = {
  // Chest exercises
  'лицеви опори': 'push-ups',
  'диамантени лицеви опори': 'diamond push-ups',
  'лег на пейка': 'bench press',
  'летящи с дъмбели': 'dumbbell flyes',

  // Back exercises
  'лостове': 'pull-ups',
  'тяга с лоста': 'barbell row',
  'едноръчна тяга': 'one arm dumbbell row',
  'мъртва тяга': 'deadlift',

  // Legs exercises
  'клекове': 'squats',
  'напади': 'lunges',
  'bulgarian split squat': 'bulgarian split squat',
  'leg press': 'leg press',
  'leg curl': 'leg curl',

  // Shoulders exercises
  'military press': 'military press',
  'странични вдигания': 'lateral raises',
  'предни вдигания': 'front raises',

  // Arms exercises
  'biceps curl': 'biceps curl',
  'hammer curl': 'hammer curl',
  'triceps extension': 'triceps extension',
  'triceps dips': 'triceps dips',

  // Core exercises
  'планк': 'plank',
  'коремни': 'crunches',
  'bicycle crunches': 'bicycle crunches',
  'leg raises': 'leg raises',

  // Cardio/Yoga
  'бягане': 'running',
  'скачане на въже': 'jump rope',
  'burpees': 'burpees',
  'mountain climbers': 'mountain climbers',
}

/**
 * Translate Bulgarian exercise name to English
 */
export function translateExerciseName(bulgarianName: string): string {
  const normalized = bulgarianName.toLowerCase().trim()
  return exerciseNameMap[normalized] || bulgarianName
}

/**
 * Find exercise by Bulgarian name
 * Translates to English and searches API
 */
export async function findExerciseByBulgarianName(
  bulgarianName: string
): Promise<ExerciseDBExercise | null> {
  const englishName = translateExerciseName(bulgarianName)
  const results = await searchExercises(englishName, 5)

  if (results.length === 0) {
    return null
  }

  // Return first result (best match)
  return results[0]
}

/**
 * Batch find exercises by Bulgarian names
 * Useful for loading multiple exercises at once
 */
export async function findExercisesByBulgarianNames(
  bulgarianNames: string[]
): Promise<Map<string, ExerciseDBExercise | null>> {
  const resultMap = new Map<string, ExerciseDBExercise | null>()

  // Process in parallel with rate limiting
  const promises = bulgarianNames.map(async (name) => {
    const exercise = await findExerciseByBulgarianName(name)
    resultMap.set(name, exercise)
  })

  await Promise.all(promises)

  return resultMap
}

/**
 * Cache wrapper for exercise lookups
 * Uses Next.js cache with 24-hour revalidation
 */
export async function getCachedExercise(id: string): Promise<ExerciseDBExercise> {
  'use cache'
  return getExerciseById(id)
}
