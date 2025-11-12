'use client'

/**
 * Quiz Results Page - Category-based quiz system
 * Shows total score, section breakdown, and CTA
 * Checks if user has purchased products and shows appropriate CTA
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ShoppingCart, AlertCircle, LogIn, Phone } from 'lucide-react'
import { CountdownTimer } from '@/components/quiz/CountdownTimer'
import type { QuizResult } from '@/lib/data/quiz/types'
import { getCategoryInfo } from '@/lib/data/quiz'
import { getScoreLevelDisplay, getSectionLabel } from '@/lib/utils/quiz-scoring'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null)
  const [checkingPurchase, setCheckingPurchase] = useState(true)
  const [timerExpired, setTimerExpired] = useState(false)

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
      // Check if user has purchased products
      checkUserPurchase(storedEmail)
    } else {
      setCheckingPurchase(false)
    }

    // Extract user's name from text_input responses
    const nameResponse = parsed.responses.find((r) => r.question_id.includes('name'))
    if (nameResponse && typeof nameResponse.answer === 'string') {
      setUserName(nameResponse.answer)
    }
  }, [router])

  const checkUserPurchase = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/shopify/check-purchase?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setHasPurchased(data.hasPurchased)
      }
    } catch (error) {
      console.error('Error checking purchase:', error)
    } finally {
      setCheckingPurchase(false)
    }
  }

  const handleTimerExpire = () => {
    setTimerExpired(true)
  }

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

  // Shopify prefilled cart links
  const sampleCartUrl = `https://shop.testograph.eu/cart/62500534092125:1?attributes[email]=${encodeURIComponent(email)}${userName ? `&attributes[name]=${encodeURIComponent(userName)}` : ''}`
  const fullCartUrl = `https://shop.testograph.eu/checkouts/cn/hWN5AxOe7Ez74iabbczZBwSR/en-bg?_r=AQABm6N-zrCnZALm3rN6tq1O-k_4w5XiFYeK8o_H5jMsT6E&auto_redirect=false&edge_redirect=true&preview_theme_id=188849914205&skip_shop_pay=true`

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

        {/* CTA Section - Conditional based on purchase status */}
        {checkingPurchase ? (
          <div className="bg-background rounded-2xl p-6 shadow-lg border border-border text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-sm text-muted-foreground mt-4">Проверяваме вашия статус...</p>
          </div>
        ) : hasPurchased ? (
          // Scenario 1: User HAS purchased - Show login button
          <div
            className="bg-background rounded-2xl p-6 shadow-lg border-2"
            style={{ borderColor: categoryInfo.color }}
          >
            <div className="text-center mb-6">
              <div className="inline-block p-4 rounded-full bg-success/20 mb-4">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h3 className="font-bold text-2xl mb-2">
                {userName ? `${userName}, имаш` : 'Имаш'} активна поръчка!
              </h3>
              <p className="text-muted-foreground">
                Открихме че вече си закупил TestoUP. Влез в системата за достъп до пълната програма.
              </p>
            </div>

            <a href="https://app.testograph.eu/app" target="_blank" rel="noopener noreferrer">
              <Button size="lg" fullWidth className="group">
                <LogIn className="w-5 h-5 mr-2" />
                Вход в системата
              </Button>
            </a>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Ще използваш имейл: <strong>{email}</strong>
            </p>
          </div>
        ) : !timerExpired ? (
          // Scenario 2: User has NOT purchased - Show promo offers with timer
          <div
            className="bg-background rounded-2xl p-6 shadow-lg border-2"
            style={{ borderColor: levelDisplay.color }}
          >
            {/* Timer */}
            <div className="bg-destructive/10 border-2 border-destructive/20 rounded-xl p-4 mb-6">
              <p className="text-center text-sm font-medium mb-2">Специална оферта изтича след:</p>
              <CountdownTimer durationMinutes={2} onExpire={handleTimerExpire} />
            </div>

            <div className="text-center mb-6">
              <h3 className="font-bold text-2xl mb-2">
                {userName ? `${userName}, ${levelDisplay.cta.toLowerCase()}` : levelDisplay.cta}
              </h3>
              <p className="text-muted-foreground">
                Избери един от специалните пакети с отстъпка
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

            {/* Offer Buttons */}
            <div className="space-y-4">
              {/* 3 Months Package */}
              <div className="border-2 border-primary rounded-xl p-4 bg-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg">3 месеца TestoUP</h4>
                    <p className="text-sm text-muted-foreground">90 дни пълна програма</p>
                    <p className="text-sm mt-1">
                      <span className="line-through text-muted-foreground">201 лв</span>{' '}
                      <span className="font-bold text-primary">159 лв</span>
                    </p>
                  </div>
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    -21%
                  </div>
                </div>
                <a href={fullCartUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" fullWidth className="group">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Вземи за 159 лв (спести 42 лв)
                  </Button>
                </a>
              </div>

              {/* Free 7 Days Sample */}
              <div className="border-2 border-amber-500 rounded-xl p-4 bg-amber-500/5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg">Безплатна проба 7 дни</h4>
                    <p className="text-sm text-muted-foreground">14 броя TestoUP Sample</p>
                  </div>
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    БЕЗПЛАТНО
                  </div>
                </div>
                <a href={sampleCartUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" fullWidth variant="outline" className="group">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Вземи безплатна проба за 7 дни
                  </Button>
                </a>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              След покупка ще получиш достъп до пълната програма в приложението
            </p>
          </div>
        ) : (
          // Scenario 3: Timer expired
          <div className="bg-background rounded-2xl p-6 shadow-lg border-2 border-muted">
            <div className="text-center mb-6">
              <div className="inline-block p-4 rounded-full bg-muted mb-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">Промо офертата изтече</h3>
              <p className="text-muted-foreground mb-6">
                Специалната оферта вече не е активна, но можеш да се свържеш с нас за повече информация.
              </p>
            </div>

            <a href="tel:+359879282299">
              <Button size="lg" fullWidth variant="outline" className="group">
                <Phone className="w-5 h-5 mr-2" />
                Обади се: +359 879 282 299
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
