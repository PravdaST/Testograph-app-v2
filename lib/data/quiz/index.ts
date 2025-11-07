/**
 * Quiz Data - Category-based quiz system
 * Export all quiz questions for libido, energy, and muscle categories
 */

import type { CategoryQuiz, QuizCategory, QuizQuestion } from './types'

// Import JSON files
import libidoData from './libido.json'
import energyData from './energy.json'
import muscleData from './muscle.json'

// Type cast JSON data
export const LIBIDO_QUIZ = libidoData as CategoryQuiz
export const ENERGY_QUIZ = energyData as CategoryQuiz
export const MUSCLE_QUIZ = muscleData as CategoryQuiz

// Map categories to their quiz data
export const QUIZ_DATA: Record<QuizCategory, CategoryQuiz> = {
  libido: LIBIDO_QUIZ,
  energy: ENERGY_QUIZ,
  muscle: MUSCLE_QUIZ,
}

/**
 * Get quiz questions for a specific category
 */
export function getQuizForCategory(category: QuizCategory): CategoryQuiz {
  return QUIZ_DATA[category]
}

/**
 * Get specific question by ID within a category
 */
export function getQuestionById(
  category: QuizCategory,
  questionId: string
): QuizQuestion | undefined {
  const quiz = QUIZ_DATA[category]
  return quiz.questions.find((q) => q.id === questionId)
}

/**
 * Get questions by section within a category
 */
export function getQuestionsBySection(
  category: QuizCategory,
  section: string
): QuizQuestion[] {
  const quiz = QUIZ_DATA[category]
  return quiz.questions.filter((q) => q.section === section)
}

// Re-export types and categories
export * from './types'
export * from './categories'
