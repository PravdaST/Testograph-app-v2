'use client'

/**
 * Quiz Questions Page - Dynamic category-based quiz
 * Steps 0-23: Quiz questions (24 questions)
 * Step 24: Email capture
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { QuizSlider } from '@/components/quiz/QuizSlider'
import { BMIInput } from '@/components/quiz/BMIInput'
import { getQuizForCategory, getCategoryInfo, type QuizCategory, type QuizQuestion } from '@/lib/data/quiz'
import { calculateQuizScore } from '@/lib/utils/quiz-scoring'
import { ArrowLeft, ArrowRight, Mail, Sparkles } from 'lucide-react'

interface PageProps {
  params: Promise<{ category: string }>
}

export default function CategoryQuizPage({ params }: PageProps) {
  const router = useRouter()
  const [category, setCategory] = useState<QuizCategory | null>(null)
  const [currentStep, setCurrentStep] = useState(0) // Start from step 0, email is at the end
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [responses, setResponses] = useState<Record<string, number | string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [textInputErrors, setTextInputErrors] = useState<Record<string, string>>({})

  // Unwrap params (Next.js 15 async params)
  useEffect(() => {
    params.then((p) => {
      const cat = p.category as QuizCategory
      if (!['libido', 'energy', 'muscle'].includes(cat)) {
        router.push('/quiz')
        return
      }
      setCategory(cat)
      setIsLoading(false)
    })
  }, [params, router])

  if (isLoading || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const quizData = getQuizForCategory(category)
  const categoryInfo = getCategoryInfo(category)
  const questions = quizData.questions
  const totalSteps = questions.length + 1 // +1 for email step at the end
  const isEmailStep = currentStep === questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const currentQuestion: QuizQuestion | null = !isEmailStep ? questions[currentStep] : null

  // Handle answer selection
  const handleAnswer = (value: number | string) => {
    if (!currentQuestion) return

    // Always save the value first
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))

    // Then validate text inputs and show errors (but don't block input)
    if (currentQuestion.type === 'text_input' && typeof value === 'string') {
      const error = validateTextInput(value, currentQuestion.id)
      if (error) {
        setTextInputErrors((prev) => ({ ...prev, [currentQuestion.id]: error }))
      } else {
        // Clear error if valid
        setTextInputErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[currentQuestion.id]
          return newErrors
        })
      }
    }
  }

  // Validate text input fields
  const validateTextInput = (value: string, questionId: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Полето е задължително'
    }

    if (value.trim().length > 50) {
      return 'Максимум 50 символа'
    }

    // Name validation (only letters and spaces)
    if (questionId.includes('name')) {
      const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/
      if (!nameRegex.test(value)) {
        return 'Само букви и интервали'
      }
    }

    return null // No error
  }

  // Determine dynamic copy condition based on responses
  const getDynamicCondition = (): string => {
    if (!category) return 'average_habits'

    const responseValues = Object.values(responses)
    if (responseValues.length < 5) return 'average_habits' // Not enough data yet

    // Calculate habit score from nutrition/lifestyle questions
    // Questions about nutrition (q11), smoking (q12), alcohol (q13), sleep (q14)
    const nutritionQ = responses[`${category.slice(0,3)}_q11`]
    const smokingQ = responses[`${category.slice(0,3)}_q12`]
    const alcoholQ = responses[`${category.slice(0,3)}_q13`]
    const sleepQ = responses[`${category.slice(0,3)}_q14`]

    let habitScore = 0
    let habitCount = 0

    // Aggregate habit patterns
    if (typeof nutritionQ === 'string') {
      // Check if healthy nutrition choice
      if (nutritionQ.includes('balanced') || nutritionQ.includes('healthy')) habitScore += 2
      else if (nutritionQ.includes('average')) habitScore += 1
      habitCount++
    }

    if (typeof smokingQ === 'string') {
      if (smokingQ.includes('non')) habitScore += 2
      else if (smokingQ.includes('occasionally')) habitScore += 1
      habitCount++
    }

    if (typeof alcoholQ === 'string') {
      if (alcoholQ.includes('rarely') || alcoholQ.includes('non')) habitScore += 2
      else if (alcoholQ.includes('moderate')) habitScore += 1
      habitCount++
    }

    if (typeof sleepQ === 'number') {
      if (sleepQ >= 7) habitScore += 2
      else if (sleepQ >= 6) habitScore += 1
      habitCount++
    }

    if (habitCount === 0) return 'average_habits'

    const avgHabitScore = habitScore / habitCount

    // Determine condition
    if (avgHabitScore >= 1.5) return 'healthy_habits'
    if (avgHabitScore >= 0.8) return 'average_habits'
    return 'unhealthy_habits'
  }

  // Get dynamic copy text for current question
  const getDynamicCopy = (question: QuizQuestion): string => {
    if (!question.dynamic_copy || question.dynamic_copy.length === 0) {
      return question.description || ''
    }

    const condition = getDynamicCondition()
    const matchingVariant = question.dynamic_copy.find((v) => v.condition === condition)

    if (matchingVariant) {
      // TODO: Replace variables if needed (e.g., {name})
      return matchingVariant.text
    }

    // Fallback to first variant or description
    return question.dynamic_copy[0]?.text || question.description || ''
  }

  // Navigation
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      // Auto-advance through transition messages
      if (currentQuestion?.type === 'transition_message') {
        setCurrentStep((prev) => prev + 1)
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Handle email submission and final submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email || !email.includes('@')) {
      setEmailError('Моля въведи валиден email адрес')
      return
    }

    if (!category) return

    setIsLoading(true)

    try {
      // Calculate quiz score
      const result = calculateQuizScore(responses, category)

      // Save to database via API
      const response = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          email,
          result,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save quiz results')
      }

      // Store result in sessionStorage for results page
      sessionStorage.setItem('quizResult', JSON.stringify(result))
      sessionStorage.setItem('quizEmail', email)

      // Save email to localStorage for future use
      localStorage.setItem('quizEmail', email)

      // Navigate to results
      router.push(`/results?category=${category}`)
    } catch (error) {
      console.error('Error saving quiz:', error)
      setEmailError('Грешка при запазване. Моля опитай отново.')
      setIsLoading(false)
    }
  }

  // ========== EMAIL CAPTURE SCREEN (Final Step) ==========
  if (isEmailStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset flex items-center justify-center">
        <div className="container-mobile max-w-md py-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Почти готово!
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: categoryInfo.color
                }}
              />
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Къде да изпратим резултатите?</h2>
              <p className="text-muted-foreground">
                Получи персонализирания PDF отчет и достъп до програмата
              </p>
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-medium">
                <Mail className="inline w-4 h-4 mr-2" />
                Email адрес
              </label>
              <input
                id="email"
                type="email"
                placeholder="ivan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background
                         focus:border-primary focus:outline-none transition-colors"
                autoFocus
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>

            {/* Trust signals */}
            <div className="bg-accent/30 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium">Ще получиш:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Детайлен PDF отчет с резултатите</li>
                <li>• Персонализирани препоръки</li>
                <li>• Специална отстъпка за програмата</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3">
              <Button type="submit" size="lg" fullWidth className="group">
                Виж резултатите
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                fullWidth
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Назад
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ========== QUIZ QUESTIONS SCREEN ==========
  if (!currentQuestion) return null

  const isFirstQuestion = currentStep === 0
  const isTransitionMessage = currentQuestion.type === 'transition_message'
  const isTextInput = currentQuestion.type === 'text_input'
  const hasValidationError = textInputErrors[currentQuestion.id] !== undefined
  const hasAnswer = (responses[currentQuestion.id] !== undefined && !hasValidationError) || isTransitionMessage

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container-mobile py-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-muted-foreground">
              Въпрос {currentStep + 1} от {totalSteps}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: categoryInfo.color
              }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 container-mobile py-4">
        <div className="space-y-4">
          {/* Section Badge */}
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-medium">
            {currentQuestion.section === 'symptoms' && 'Симптоми'}
            {currentQuestion.section === 'nutrition' && 'Хранене'}
            {currentQuestion.section === 'training' && 'Тренировки'}
            {currentQuestion.section === 'sleep_recovery' && 'Сън и възстановяване'}
            {currentQuestion.section === 'demographics' && 'Демография'}
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-lg font-bold leading-tight mb-1.5">
              {currentQuestion.question}
            </h2>
            {(currentQuestion.description || currentQuestion.dynamic_copy) && (
              <p className="text-sm text-muted-foreground">
                {getDynamicCopy(currentQuestion)}
              </p>
            )}
          </div>

          {/* AI Generated Image - hidden on mobile for space */}
          {currentQuestion.ai_image_prompt && (
            <div className="hidden">
              {/* Reserved for future AI image generation */}
            </div>
          )}

          {/* Answer Input */}
          {currentQuestion.type === 'transition_message' ? (
            // Transition message - no input needed
            <div className="bg-accent/20 rounded-lg p-6 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Продължаваме напред!</p>
            </div>
          ) : currentQuestion.type === 'text_input' ? (
            // Text input with inline submit button
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentQuestion.placeholder || 'Въведи отговор...'}
                  value={(responses[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && hasAnswer && !hasValidationError) {
                      handleNext()
                    }
                  }}
                  className={`w-full px-4 py-3 pr-14 rounded-lg border-2 bg-background
                           focus:outline-none transition-colors text-base
                           ${hasValidationError ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'}`}
                  autoFocus
                />
                <button
                  onClick={handleNext}
                  disabled={!hasAnswer || hasValidationError}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-primary/90"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {hasValidationError && (
                <p className="text-sm text-destructive">
                  {textInputErrors[currentQuestion.id]}
                </p>
              )}
            </div>
          ) : currentQuestion.type === 'bmi_input' ? (
            // BMI Input (height + weight = BMI)
            <BMIInput
              value={responses[currentQuestion.id] as unknown as { height: number; weight: number; bmi: number } | null}
              onChange={(bmiData) => handleAnswer(bmiData as unknown as number)}
            />
          ) : currentQuestion.type === 'scale' && currentQuestion.scale ? (
            <QuizSlider
              min={currentQuestion.scale.min}
              max={currentQuestion.scale.max}
              step={1}
              value={responses[currentQuestion.id] as number | null}
              unit=""
              onChange={(value) => {
                handleAnswer(value)
                // Auto-advance after slider selection with slightly longer delay
                setTimeout(handleNext, 600)
              }}
            />
          ) : currentQuestion.type === 'single_choice' && currentQuestion.options ? (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(option.id)
                    // Auto-advance after selection with small delay for visual feedback
                    setTimeout(handleNext, 400)
                  }}
                  className={`
                    w-full p-2.5 text-left rounded-lg border-2 transition-all
                    ${
                      responses[currentQuestion.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <p className="text-sm font-medium">{option.text}</p>
                  {option.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  )}
                  {option.note && responses[currentQuestion.id] === option.id && (
                    <p className="text-xs text-primary mt-1">
                      💡 {option.note}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

    </div>
  )
}
