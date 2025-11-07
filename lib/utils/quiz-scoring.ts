/**
 * Quiz Scoring Logic - Calculate scores and determine levels
 * Category-based quiz system (libido/energy/muscle)
 */

import type {
  QuizCategory,
  QuizQuestion,
  QuizResponse,
  QuizResult,
  QuizBreakdown,
  CategoryQuiz,
} from '@/lib/data/quiz/types'

// Import quiz data
import { LIBIDO_QUIZ, ENERGY_QUIZ, MUSCLE_QUIZ } from '@/lib/data/quiz'

/**
 * Calculate quiz score from user responses
 * @param responses - User's answers (question_id -> value)
 * @param category - Quiz category (libido/energy/muscle)
 * @returns Complete quiz result with score, breakdown, and level
 */
export function calculateQuizScore(
  responses: Record<string, number | string>,
  category: QuizCategory
): QuizResult {
  // Get the appropriate question set
  const quizData = getQuizData(category)
  if (!quizData) {
    throw new Error(`Invalid category: ${category}`)
  }

  const questions = quizData.questions
  const maxScore = quizData.quiz_metadata.max_score

  // Initialize section scores
  const sectionScores: Record<
    string,
    { total: number; count: number; maxPerQuestion: number }
  > = {
    symptoms: { total: 0, count: 0, maxPerQuestion: 10 },
    nutrition: { total: 0, count: 0, maxPerQuestion: 10 },
    training: { total: 0, count: 0, maxPerQuestion: 10 },
    sleep_recovery: { total: 0, count: 0, maxPerQuestion: 10 },
    context: { total: 0, count: 0, maxPerQuestion: 10 },
  }

  let totalScore = 0
  const quizResponses: QuizResponse[] = []

  // Loop through all questions and calculate scores
  questions.forEach((question: QuizQuestion) => {
    const answer = responses[question.id]

    // Skip questions that don't contribute to score
    if (question.type === 'transition_message') {
      return // No scoring for transition messages
    }

    if (question.type === 'text_input') {
      // Save text input responses but don't score them
      if (answer !== undefined) {
        quizResponses.push({
          question_id: question.id,
          answer,
          points: 0,
        })
      }
      return
    }

    if (answer === undefined) return

    let points = 0

    // Calculate points based on question type
    if (question.type === 'scale' && question.scale) {
      // Scale questions: value * multiplier
      const value = typeof answer === 'number' ? answer : 0
      points = value * question.scale.points_multiplier
    } else if (question.type === 'single_choice' && question.options) {
      // Single choice: find the selected option and get its points
      const selectedOption = question.options.find((opt) => opt.id === answer)
      points = selectedOption?.points || 0
    }

    totalScore += points

    // Add to section score
    const section = question.section
    if (sectionScores[section]) {
      sectionScores[section].total += points
      sectionScores[section].count += 1
    }

    // Save response
    quizResponses.push({
      question_id: question.id,
      answer,
      points,
    })
  })

  // Calculate normalized section scores (0-10 scale)
  const breakdown: QuizBreakdown = {
    symptoms: 0,
    nutrition: 0,
    training: 0,
    sleep_recovery: 0,
    context: 0,
    overall: 0,
  }

  Object.keys(sectionScores).forEach((section) => {
    const data = sectionScores[section]
    if (data.count > 0) {
      const maxPossible = data.count * data.maxPerQuestion
      const normalizedScore = (data.total / maxPossible) * 10

      // Map to breakdown properties
      if (section === 'symptoms') {
        breakdown.symptoms = Math.round(normalizedScore)
      } else if (section === 'nutrition') {
        breakdown.nutrition = Math.round(normalizedScore)
      } else if (section === 'training') {
        breakdown.training = Math.round(normalizedScore)
      } else if (section === 'sleep_recovery') {
        breakdown.sleep_recovery = Math.round(normalizedScore)
      } else if (section === 'context') {
        breakdown.context = Math.round(normalizedScore)
      }
    }
  })

  // Normalize total score to 0-100 scale
  const normalizedScore = Math.min(100, Math.round((totalScore / maxScore) * 100))
  breakdown.overall = normalizedScore

  // Get score level
  const level = getScoreLevel(normalizedScore)

  return {
    category,
    total_score: normalizedScore,
    determined_level: level,
    breakdown,
    responses: quizResponses,
    completed_at: new Date().toISOString(),
  }
}

/**
 * Get quiz data for a specific category
 */
function getQuizData(category: QuizCategory): CategoryQuiz | null {
  switch (category) {
    case 'libido':
      return LIBIDO_QUIZ
    case 'energy':
      return ENERGY_QUIZ
    case 'muscle':
      return MUSCLE_QUIZ
    default:
      return null
  }
}

/**
 * Determine score level based on total score
 * Note: Higher score = Better health = More intensive program
 *
 * @param score - Total score (0-100)
 * @returns Level: 'low' (foundation), 'normal' (moderate), or 'high' (advanced)
 */
export function getScoreLevel(score: number): 'low' | 'normal' | 'high' {
  // Level mapping for workout/meal plan intensity:
  // 71-100 = 'high' (excellent health = ready for advanced/intensive programs)
  // 41-70 = 'normal' (good health = standard moderate programs)
  // 0-40 = 'low' (poor health = gentle foundation programs)

  if (score >= 71) {
    return 'high' // Excellent health - ready for intensive/advanced training
  } else if (score >= 41) {
    return 'normal' // Good health - standard moderate program
  } else {
    return 'low' // Poor health - needs gentle foundation program
  }
}

/**
 * Get display information for score level (for UI)
 */
export function getScoreLevelDisplay(score: number) {
  if (score >= 71) {
    return {
      level: 'high' as const,
      displayLevel: 'excellent' as const,
      color: '#10B981', // green-500
      title: 'ОТЛИЧНО',
      message: 'Поздравления! В много добра форма си и готов за интензивна програма.',
      cta: 'Стани още по-добър',
      discount: 15,
    }
  } else if (score >= 41) {
    return {
      level: 'normal' as const,
      displayLevel: 'good' as const,
      color: '#F59E0B', // amber-500
      title: 'ДОБРО СЪСТОЯНИЕ',
      message: 'Добре си, има потенциал за подобрение.',
      cta: 'Виж как можеш да се подобриш',
      discount: 20,
    }
  } else {
    return {
      level: 'low' as const,
      displayLevel: 'critical' as const,
      color: '#EF4444', // red-500
      title: 'НУЖДА ОТ ПОДОБРЕНИЕ',
      message: 'Има значителна нужда от оптимизация. Започваме с основите.',
      cta: 'ЗАПОЧНИ НЕЗАБАВНО',
      discount: 30,
    }
  }
}

/**
 * Get section label in Bulgarian
 */
export function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    symptoms: 'Симптоми',
    nutrition: 'Хранене',
    training: 'Тренировки',
    sleep_recovery: 'Сън и възстановяване',
    context: 'Ангажираност и Цели',
  }
  return labels[section] || section
}
