'use client'

/**
 * Quiz Results Page - Category-based quiz system
 * Shows total score, section breakdown, and CTA
 * Checks if user has purchased products and shows appropriate CTA
 * Modernized design with animations - 27.11.2025
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  CheckCircle2,
  ShoppingCart,
  AlertCircle,
  LogIn,
  Phone,
  Target,
  Activity,
  Utensils,
  Dumbbell,
  Moon,
  Brain,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react'
import { CountdownTimer } from '@/components/quiz/CountdownTimer'
import type { QuizResult } from '@/lib/data/quiz/types'
import { getCategoryInfo } from '@/lib/data/quiz'
import { getScoreLevelDisplay, getSectionLabel } from '@/lib/utils/quiz-scoring'

// Section icons mapping
const sectionIcons: Record<string, { icon: React.ElementType; color: string }> = {
  symptoms: { icon: Activity, color: '#EF4444' },
  nutrition: { icon: Utensils, color: '#F59E0B' },
  training: { icon: Dumbbell, color: '#3B82F6' },
  sleep_recovery: { icon: Moon, color: '#8B5CF6' },
  context: { icon: Brain, color: '#10B981' },
}

// Animated circular score component - Main large circle
function AnimatedScoreCircle({ score, color }: { score: number; color: string }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const progress = (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Score text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {animatedScore}
        </motion.span>
        <motion.span
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          от 100 точки
        </motion.span>
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-20"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

// Mini circular score component for categories
function MiniScoreCircle({
  score,
  maxScore,
  color,
  icon: Icon,
  label,
  isCritical,
  delay,
}: {
  score: number
  maxScore: number
  color: string
  icon: React.ElementType
  label: string
  isCritical: boolean
  delay: number
}) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = (animatedScore / maxScore) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [score, delay])

  const displayColor = isCritical ? '#EF4444' : color

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
    >
      {/* Circle with icon */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={displayColor}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.2 }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${displayColor}20` }}
          >
            <Icon className="w-4 h-4" style={{ color: displayColor }} />
          </div>
        </div>

        {/* Critical indicator */}
        {isCritical && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5, type: 'spring', stiffness: 300 }}
          >
            <AlertCircle className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>

      {/* Score */}
      <motion.div
        className="mt-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
      >
        <span className="text-lg font-bold" style={{ color: displayColor }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">/{maxScore}</span>
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-[10px] text-muted-foreground text-center mt-0.5 max-w-[60px] leading-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null)
  const [hasPaidPurchase, setHasPaidPurchase] = useState<boolean>(false)
  const [hasPendingOrder, setHasPendingOrder] = useState<boolean>(false)
  const [checkingPurchase, setCheckingPurchase] = useState(true)
  const [timerExpired, setTimerExpired] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Track step events
  const trackStep = async (
    eventType: string,
    stepNumber: number,
    questionId: string | undefined,
    category: string,
    sessionIdValue: string,
    answerValue?: string
  ) => {
    try {
      await fetch('/api/quiz/track-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionIdValue,
          category,
          step_number: stepNumber,
          question_id: questionId,
          event_type: eventType,
          answer_value: answerValue,
        }),
      })
    } catch (error) {
      // Silently ignore tracking errors
    }
  }

  // Track offer clicks using sendBeacon for reliable tracking on navigation
  const handleOfferClick = (offerType: 'testoup_3months' | 'free_sample_7days' | 'login_app') => {
    if (sessionId && result) {
      // Use sendBeacon for reliable tracking when navigating away
      // sendBeacon sends as text/plain which track-step API supports
      const data = JSON.stringify({
        session_id: sessionId,
        category: result.category,
        step_number: 27,
        question_id: 'offer_selection',
        event_type: 'offer_clicked',
        answer_value: offerType,
      })
      navigator.sendBeacon('/api/quiz/track-step', data)
    }
  }

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

    // Get session ID from sessionStorage (stored by quiz completion before localStorage clear)
    const storedSessionId = sessionStorage.getItem('quizSessionId')
    if (storedSessionId) {
      setSessionId(storedSessionId)
      // Track results_viewed event (step 27)
      trackStep('results_viewed', 27, 'results', parsed.category, storedSessionId)
    }

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
        setHasPaidPurchase(data.hasPaidPurchase || false)
        setHasPendingOrder(data.hasPendingOrder || false)
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

  // TestoUP product page URL (instead of direct cart)
  const testoUpOfferUrl = `/testoup-offer?email=${encodeURIComponent(email)}${userName ? `&name=${encodeURIComponent(userName)}` : ''}&discount=QuizzOff38`

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  } as const

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <motion.div
        className="container-mobile py-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Category Icon */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="relative inline-block mb-4">
            {/* Gradient circle background */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{
                background: `linear-gradient(135deg, ${categoryInfo.color}40, ${categoryInfo.color}80)`,
              }}
            >
              <Award className="w-10 h-10 text-white" />
            </div>
            {/* Glow effect */}
            <div
              className="absolute inset-0 w-20 h-20 rounded-full blur-xl opacity-40 mx-auto"
              style={{ backgroundColor: categoryInfo.color }}
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">Анализ завършен</h1>
          <p className="text-muted-foreground">{categoryInfo.name}</p>
        </motion.div>

        {/* Animated Score Circle */}
        <motion.div
          className="bg-background rounded-2xl p-6 shadow-lg border border-border"
          variants={itemVariants}
        >
          <AnimatedScoreCircle score={result.total_score} color={levelDisplay.color} />

          {/* Level Badge */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-3"
              style={{ backgroundColor: `${levelDisplay.color}20` }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: levelDisplay.color }} />
              <span className="font-bold" style={{ color: levelDisplay.color }}>
                {levelDisplay.title}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">{levelDisplay.message}</p>
          </motion.div>
        </motion.div>

        {/* Section Breakdown - Horizontal Circles */}
        <motion.div
          className="bg-background rounded-2xl p-5 shadow-lg border border-border"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Анализ по категории</h3>
          </div>

          {/* Horizontal layout with mini circles */}
          <div className="flex justify-between items-start px-2">
            {sections.map((section, index) => {
              const score = result.breakdown[section as keyof typeof result.breakdown]
              const isCritical = score < 6
              const sectionInfo = sectionIcons[section] || { icon: Activity, color: '#6B7280' }

              // Short labels for compact display
              const shortLabels: Record<string, string> = {
                symptoms: 'Симптоми',
                nutrition: 'Хранене',
                training: 'Трениров.',
                sleep_recovery: 'Сън',
                context: 'Цели',
              }

              return (
                <MiniScoreCircle
                  key={section}
                  score={score}
                  maxScore={10}
                  color={sectionInfo.color}
                  icon={sectionInfo.icon}
                  label={shortLabels[section] || getSectionLabel(section)}
                  isCritical={isCritical}
                  delay={1.4 + index * 0.15}
                />
              )
            })}
          </div>

          {criticalSections.length > 0 && (
            <motion.div
              className="mt-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-xs text-center">
                  <span className="font-medium text-destructive">Области за фокус: </span>
                  <span className="text-muted-foreground">
                    {criticalSections.map((s) => getSectionLabel(s)).join(', ')}
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section - Conditional based on purchase status */}
        <motion.div variants={itemVariants}>
          {checkingPurchase ? (
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-border text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-4">Проверяваме вашия статус...</p>
            </div>
          ) : hasPaidPurchase ? (
            // Scenario 1a: User HAS PAID - Show full access message
            <motion.div
              className="bg-background rounded-2xl p-6 shadow-lg border-2"
              style={{ borderColor: categoryInfo.color }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="inline-block p-4 rounded-full bg-success/20 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.6, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </motion.div>
                <h3 className="font-bold text-2xl mb-2">
                  {userName ? `${userName}, имаш` : 'Имаш'} пълен достъп!
                </h3>
                <p className="text-muted-foreground">
                  Твоята поръчка е потвърдена. Влез в системата за достъп до пълната програма.
                </p>
              </div>

              <a href="https://app.testograph.eu/app" target="_blank" rel="noopener noreferrer" onClick={() => handleOfferClick('login_app')}>
                <Button size="lg" fullWidth className="group">
                  <LogIn className="w-5 h-5 mr-2" />
                  Вход в системата
                </Button>
              </a>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Ще използваш имейл: <strong>{email}</strong>
              </p>
            </motion.div>
          ) : hasPendingOrder ? (
            // Scenario 1b: User has PENDING ORDER (not paid yet) - Show waiting message
            <motion.div
              className="bg-background rounded-2xl p-6 shadow-lg border-2 border-amber-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="inline-block p-4 rounded-full bg-amber-500/20 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.6, type: 'spring', stiffness: 200 }}
                >
                  <ShoppingCart className="w-12 h-12 text-amber-500" />
                </motion.div>
                <h3 className="font-bold text-2xl mb-2">
                  {userName ? `${userName}, имаш` : 'Имаш'} активна поръчка!
                </h3>
                <p className="text-muted-foreground">
                  Чакаме потвърждение на плащането. Данните за вход са изпратени на имейла ти.
                </p>
              </div>

              <a href="https://app.testograph.eu/app" target="_blank" rel="noopener noreferrer" onClick={() => handleOfferClick('login_app')}>
                <Button size="lg" fullWidth variant="outline" className="group border-amber-500 text-amber-600 hover:bg-amber-500/10">
                  <LogIn className="w-5 h-5 mr-2" />
                  Вход в системата
                </Button>
              </a>

              <p className="text-xs text-center text-muted-foreground mt-4">
                След плащане ще получиш пълен достъп на: <strong>{email}</strong>
              </p>
            </motion.div>
          ) : !timerExpired ? (
            // Scenario 2: User has NOT purchased - Show promo offers with timer
            <motion.div
              className="bg-background rounded-2xl p-6 shadow-lg border-2"
              style={{ borderColor: levelDisplay.color }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
            >
              {/* Timer */}
              <motion.div
                className="bg-destructive/10 border-2 border-destructive/20 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6, duration: 0.4 }}
              >
                <p className="text-center text-sm font-medium mb-2">Специална оферта изтича след:</p>
                <CountdownTimer durationMinutes={2} onExpire={handleTimerExpire} />
              </motion.div>

              <div className="text-center mb-6">
                <h3 className="font-bold text-2xl mb-2">
                  {userName ? `${userName}, ${levelDisplay.cta.toLowerCase()}` : levelDisplay.cta}
                </h3>
                <p className="text-muted-foreground">
                  Избери един от специалните пакети с отстъпка
                </p>
              </div>

              <div className="space-y-2.5 mb-6">
                {[
                  'Персонализирани тренировки според теста',
                  'Хранителен план с точни препоръки',
                  'TestoUP добавка с натурални съставки',
                  'Дневен график за оптимални резултати',
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.8 + index * 0.1, duration: 0.3 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <p className="text-sm">{benefit}</p>
                  </motion.div>
                ))}
              </div>

              {/* Offer Buttons */}
              <div className="space-y-4">
                {/* 3 Months Package */}
                <motion.div
                  className="border-2 border-primary rounded-xl p-4 bg-primary/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.2, duration: 0.4 }}
                >
                  <div className="mb-3">
                    <h4 className="font-bold text-lg">3x TestoUP бутилки</h4>
                    <p className="text-sm text-muted-foreground">90 дни пълна програма</p>
                  </div>
                  <a href={testoUpOfferUrl} onClick={() => handleOfferClick('testoup_3months')}>
                    <Button size="lg" fullWidth className="group">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Виж пълната оферта
                    </Button>
                  </a>
                </motion.div>

                {/* Free 7 Days Sample */}
                <motion.div
                  className="border-2 border-amber-500 rounded-xl p-4 bg-amber-500/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.4, duration: 0.4 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg">Безплатна проба 7 дни</h4>
                      <p className="text-sm text-muted-foreground">14 броя TestoUP Sample</p>
                    </div>
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      БЕЗПЛАТНО
                    </div>
                  </div>
                  <a href={sampleCartUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleOfferClick('free_sample_7days')}>
                    <Button size="lg" fullWidth variant="outline" className="group">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Вземи безплатна проба за 7 дни
                    </Button>
                  </a>
                </motion.div>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                След покупка ще получиш достъп до пълната програма в приложението
              </p>
            </motion.div>
          ) : (
            // Scenario 3: Timer expired
            <motion.div
              className="bg-background rounded-2xl p-6 shadow-lg border-2 border-muted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="inline-block p-4 rounded-full bg-muted mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <AlertCircle className="w-12 h-12 text-muted-foreground" />
                </motion.div>
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
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
