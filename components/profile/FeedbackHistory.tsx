'use client'

/**
 * Feedback History Component
 * Displays all feedback submissions with details
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, Calendar } from 'lucide-react'
import { getFeedbackQuestions } from '@/lib/data/feedback-questions'

interface FeedbackSubmission {
  id: string
  program_day: number
  submitted_at: string
  feedback_responses: {
    question_id: string
    answer: string
  }[]
}

interface FeedbackHistoryProps {
  submissions: FeedbackSubmission[]
}

export function FeedbackHistory({ submissions }: FeedbackHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (submissions.length === 0) {
    return (
      <div className="bg-background rounded-2xl p-8 text-center border border-border">
        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Все още няма попълнен feedback</p>
        <p className="text-sm text-muted-foreground mt-2">
          Ще получиш напомняне на всеки 7 дена
        </p>
      </div>
    )
  }

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getAnswerLabel = (questionId: string, answer: string, day: number) => {
    const questions = getFeedbackQuestions(day === 30 ? 30 : 7)
    const question = questions.find((q) => q.id === questionId)

    if (!question) return answer

    // For yes/no questions, find the label
    if (question.type === 'yesno') {
      const option = question.options?.find((opt) => opt.value === answer)
      return option?.label || answer
    }

    // For scale questions, add /10
    if (question.type === 'scale') {
      return `${answer}/10`
    }

    // For percentage, add %
    if (question.type === 'percentage') {
      return `${answer}%`
    }

    return answer
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        История на feedback-a
      </h2>

      <div className="space-y-3">
        {submissions.map((submission) => {
          const isExpanded = expandedId === submission.id
          const date = new Date(submission.submitted_at)
          const questions = getFeedbackQuestions(
            submission.program_day === 30 ? 30 : 7
          )

          return (
            <div
              key={submission.id}
              className="bg-background rounded-2xl border-2 border-border overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleExpanded(submission.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">
                      Ден {submission.program_day} feedback
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {date.toLocaleDateString('bg-BG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {/* Details */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-border">
                  <div className="space-y-4 mt-4">
                    {submission.feedback_responses.map((response, idx) => {
                      const question = questions.find(
                        (q) => q.id === response.question_id
                      )
                      if (!question) return null

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-muted/30"
                        >
                          <p className="text-sm text-muted-foreground mb-2">
                            {question.question}
                          </p>
                          <p className="font-medium">
                            {getAnswerLabel(
                              response.question_id,
                              response.answer,
                              submission.program_day
                            )}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
