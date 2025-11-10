/**
 * User utility functions for name extraction and handling
 */

export interface QuizResponse {
  question_id: string
  answer: string | number
  points?: number
}

/**
 * Extract user's first name from quiz responses
 * Looks for responses with question_id containing 'name'
 *
 * @param responses - Array of quiz responses
 * @returns User's first name or 'User' as fallback
 */
export function extractUserName(responses: QuizResponse[]): string {
  const nameResponse = responses.find((r) => r.question_id.includes('name'))

  if (nameResponse && typeof nameResponse.answer === 'string') {
    const trimmedName = nameResponse.answer.trim()
    return trimmedName.length > 0 ? trimmedName : 'User'
  }

  return 'User'
}

/**
 * Get first name from full name string
 * Handles cases like "Иван Петров" -> "Иван"
 *
 * @param fullName - Full name string
 * @returns First name only
 */
export function getFirstName(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) {
    return 'User'
  }

  const parts = fullName.trim().split(' ')
  return parts[0] || 'User'
}

/**
 * Validate if a name is valid (not empty, not too long, only letters and spaces)
 *
 * @param name - Name to validate
 * @returns True if valid, false otherwise
 */
export function isValidName(name: string): boolean {
  if (!name || name.trim().length < 2 || name.trim().length > 50) {
    return false
  }

  // Allow Cyrillic, Latin letters, and spaces
  const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/
  return nameRegex.test(name.trim())
}
