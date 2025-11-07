'use client'

/**
 * Feedback Modal Component
 * Collects user feedback on days 7, 14, 21, 28, 30
 */

import { useState } from 'react'
import { X, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  getFeedbackQuestions,
  getFeedbackTitle,
  getFeedbackDescription,
  type FeedbackDay,
  type FeedbackQuestion,
  type FeedbackResponse,
} from '@/lib/data/feedback-questions'

interface FeedbackModalProps {
  day: FeedbackDay
  onComplete: (responses: FeedbackResponse[]) => void
  onSkip: () => void
}

export function FeedbackModal({ day, onComplete, onSkip }: FeedbackModalProps) {
  const questions = getFeedbackQuestions(day)
  const [responses, setResponses] = useState<Record<string, string | number>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const currentQuestion = questions[currentStep]
  const isLastQuestion = currentStep === questions.length - 1
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = (value: string | number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const canProceed = () => {
    if (!currentQuestion.required) return true
    return responses[currentQuestion.id] !== undefined
  }

  const handleNext = () => {
    if (!canProceed()) return

    if (isLastQuestion) {
      // Submit all responses
      const formattedResponses: FeedbackResponse[] = Object.entries(responses).map(
        ([question_id, answer]) => ({
          question_id,
          answer,
        })
      )
      onComplete(formattedResponses)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{getFeedbackTitle(day)}</h2>
              <p className="text-sm text-muted-foreground">
                Въпрос {currentStep + 1} от {questions.length}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>

          {/* Scale Question (1-10) */}
          {currentQuestion.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Много лошо</span>
                <span className="text-2xl font-bold text-foreground">
                  {responses[currentQuestion.id] || '-'}
                </span>
                <span>Отлично</span>
              </div>
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={responses[currentQuestion.id] || currentQuestion.min}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {Array.from(
                  { length: (currentQuestion.max || 10) - (currentQuestion.min || 1) + 1 },
                  (_, i) => (currentQuestion.min || 1) + i
                ).map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>
          )}

          {/* Yes/No Question */}
          {currentQuestion.type === 'yesno' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    responses[currentQuestion.id] === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Percentage Question */}
          {currentQuestion.type === 'percentage' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">
                  {responses[currentQuestion.id] || 0}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={responses[currentQuestion.id] || 0}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Text Question */}
          {currentQuestion.type === 'text' && (
            <textarea
              value={(responses[currentQuestion.id] as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Въведи своя отговор..."
              rows={4}
              className="w-full p-4 rounded-xl border-2 border-border focus:border-primary focus:outline-none resize-none bg-background"
            />
          )}

          {!currentQuestion.required && (
            <p className="text-sm text-muted-foreground mt-3">* Опционален въпрос</p>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Назад
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1"
          >
            {isLastQuestion ? 'Изпрати' : 'Напред'}
          </Button>
        </div>
      </div>
    </div>
  )
}
