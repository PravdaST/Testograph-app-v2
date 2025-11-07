'use client'

/**
 * Quiz Results Page - Category-based quiz system
 * Shows total score, section breakdown, and CTA to shop
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ShoppingCart, AlertCircle } from 'lucide-react'
import type { QuizResult } from '@/lib/data/quiz/types'
import { getCategoryInfo } from '@/lib/data/quiz'
import { getScoreLevelDisplay, getSectionLabel } from '@/lib/utils/quiz-scoring'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Load quiz result from sessionStorage
    const storedResult = sessionStorage.getItem('quizResult')
    const storedEmail = sessionStorage.getItem('quizEmail')

    if (!storedResult) {
      // No result found - redirect to quiz
      router.push('/quiz')
      return
    }

    const parsed = JSON.parse(storedResult) as QuizResult
    setResult(parsed)

    if (storedEmail) {
      setEmail(storedEmail)
    }

    // Extract user's name from text_input responses
    const nameResponse = parsed.responses.find((r) => r.question_id.includes('name'))
    if (nameResponse && typeof nameResponse.answer === 'string') {
      setUserName(nameResponse.answer)
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const categoryInfo = getCategoryInfo(result.category)
  const levelDisplay = getScoreLevelDisplay(result.total_score)
  const sections = ['symptoms', 'nutrition', 'training', 'sleep_recovery', 'context']
  const criticalSections = sections.filter((s) => result.breakdown[s as keyof typeof result.breakdown] < 6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <div className="container-mobile py-8 space-y-8">
        {/* Category Badge */}
        <div className="text-center">
          <div
            className="inline-block text-5xl p-4 rounded-2xl mb-4"
            style={{ backgroundColor: `${categoryInfo.color}20` }}
          >
            {categoryInfo.emoji}
          </div>
          <h2 className="text-xl font-semibold text-muted-foreground">{categoryInfo.name}</h2>
        </div>

        {/* Score Display */}
        <div className="bg-background rounded-2xl p-8 shadow-lg border border-border text-center">
          <div className="mb-6">
            <div
              className="text-7xl font-bold mb-2"
              style={{ color: levelDisplay.color }}
            >
              {result.total_score}
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Общ резултат</p>
          </div>

          {/* Level Badge */}
          <div
            className="inline-block px-6 py-3 rounded-full mb-4"
            style={{ backgroundColor: `${levelDisplay.color}20` }}
          >
            <p className="font-bold text-lg" style={{ color: levelDisplay.color }}>
              {levelDisplay.title}
            </p>
          </div>

          <p className="text-muted-foreground mb-6">{levelDisplay.message}</p>
        </div>

        {/* Breakdown by Section */}
        <div className="bg-background rounded-2xl p-6 shadow-lg border border-border">
          <h3 className="font-bold text-lg mb-6">Детайлен breakdown</h3>

          <div className="space-y-5">
            {sections.map((section) => {
              const score = result.breakdown[section as keyof typeof result.breakdown]
              const isCritical = score < 6

              return (
                <div key={section}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {getSectionLabel(section)}
                      {isCritical && <AlertCircle className="w-4 h-4 text-destructive" />}
                    </span>
                    <span className="text-sm font-bold">{score}/10</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${(score / 10) * 100}%`,
                        backgroundColor: isCritical ? '#EF4444' : categoryInfo.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {criticalSections.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-2">
                Критични области за подобрение:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {criticalSections.map((section) => (
                  <li key={section}>• {getSectionLabel(section)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA to Shop */}
        <div
          className="bg-background rounded-2xl p-6 shadow-lg border-2"
          style={{ borderColor: levelDisplay.color }}
        >
          <div className="text-center mb-6">
            <h3 className="font-bold text-2xl mb-2">
              {userName ? `${userName}, ${levelDisplay.cta.toLowerCase()}` : levelDisplay.cta}
            </h3>
            <p className="text-muted-foreground">
              Започни 30-дневната програма за оптимизация на тестостерона
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm">Персонализирани тренировки според теста</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm">Хранителен план с точни препоръки</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm">TestoUP добавка с натурални съставки</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm">Дневен график за оптимални резултати</p>
            </div>
          </div>

          {/* Discount Badge */}
          <div className="text-center mb-6">
            <div
              className="inline-block px-6 py-3 rounded-lg text-white font-bold text-xl"
              style={{ backgroundColor: levelDisplay.color }}
            >
              -{levelDisplay.discount}% ОТСТЪПКА
            </div>
            <p className="text-xs text-muted-foreground mt-2">Валидна 24 часа</p>
          </div>

          {/* Shop Button */}
          <a href={`https://shop.testograph.eu?discount=${levelDisplay.discount}&email=${email}${userName ? `&name=${encodeURIComponent(userName)}` : ''}`} target="_blank" rel="noopener noreferrer">
            <Button size="lg" fullWidth className="group">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {userName ? `${userName}, поръчай` : 'Поръчай'} с {levelDisplay.discount}% отстъпка
            </Button>
          </a>

          <p className="text-xs text-center text-muted-foreground mt-4">
            След покупка ще получиш достъп до пълната програма в приложението
          </p>
        </div>
      </div>
    </div>
  )
}
