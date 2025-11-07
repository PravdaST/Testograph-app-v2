/**
 * Mock Workout Data
 * Exercise programs with ExerciseDB integration
 * Includes both GYM and HOME workout variations
 */

export interface Exercise {
  exercisedb_id: string // ExerciseDB API ID
  name_bg: string // Bulgarian name
  name_en: string // English name for API
  sets: number
  reps: number | string // Can be "10-12" or just "12"
  rest_seconds: number
  notes?: string
}

export interface WorkoutProgram {
  day_of_week: number
  name: string
  duration: number
  exercises: Exercise[]
}

export type WorkoutType = 'gym' | 'home'

// Re-export from specific files
export { MOCK_WORKOUTS as GYM_WORKOUTS } from './mock-workouts-gym'
export { HOME_WORKOUTS } from './mock-workouts-home'

// Default export - GYM workouts
export { MOCK_WORKOUTS } from './mock-workouts-gym'
