/**
 * Recipe Type Definition
 * Comprehensive recipe structure for meal preparation instructions
 */

/**
 * Difficulty level for recipe preparation
 */
export type RecipeDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Complete recipe with cooking instructions
 */
export interface Recipe {
  /** Numbered steps for preparation (e.g., ["1. Нарежи пилето на парчета", "2. Загрей тиган на среден огън"]) */
  steps: string[]

  /** Preparation time in minutes (cutting, mixing, etc.) */
  prep_time: number

  /** Cooking time in minutes (actual heat application) */
  cook_time: number

  /** Total time (prep + cook) - calculated automatically */
  total_time: number

  /** Recipe difficulty level */
  difficulty: RecipeDifficulty

  /** Optional cooking tips and tricks */
  tips?: string[]

  /** Special notes (allergies, storage, substitutions) */
  special_notes?: string

  /** Equipment needed (optional) */
  equipment?: string[]
}

/**
 * Helper function to create a recipe with auto-calculated total time
 */
export function createRecipe(
  steps: string[],
  prep_time: number,
  cook_time: number,
  difficulty: RecipeDifficulty,
  options?: {
    tips?: string[]
    special_notes?: string
    equipment?: string[]
  }
): Recipe {
  return {
    steps,
    prep_time,
    cook_time,
    total_time: prep_time + cook_time,
    difficulty,
    ...options,
  }
}

/**
 * Get difficulty label in Bulgarian
 */
export function getDifficultyLabel(difficulty: RecipeDifficulty): string {
  const labels: Record<RecipeDifficulty, string> = {
    easy: 'Лесно',
    medium: 'Средно',
    hard: 'Трудно',
  }
  return labels[difficulty]
}

/**
 * Get difficulty color for UI badges
 */
export function getDifficultyColor(difficulty: RecipeDifficulty): string {
  const colors: Record<RecipeDifficulty, string> = {
    easy: '#10B981', // green
    medium: '#F59E0B', // amber
    hard: '#EF4444', // red
  }
  return colors[difficulty]
}

/**
 * Format time for display (e.g., "45 мин" or "1ч 15мин")
 */
export function formatRecipeTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}ч`
  }

  return `${hours}ч ${remainingMinutes}мин`
}
