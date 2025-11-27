'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import CountUp from 'react-countup'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Ruler, Scale, Activity, Heart, Moon, Brain, Wine, Cigarette, Utensils, Dumbbell, CheckCircle2, AlertCircle, Trophy, Target, Sparkles, FileText, TrendingUp, Zap } from 'lucide-react'
import type { AnimationConfig } from '@/lib/data/quiz/types'
import { SocialProofGrid } from './SocialProofGrid'

// Dynamic import за Lottie (за да не натоварваме bundle-а)
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface AnimatedTransitionProps {
  question: string
  description: string
  animation?: AnimationConfig
  onContinue: () => void
}

export function AnimatedTransition({
  question,
  description,
  animation,
  onContinue,
}: AnimatedTransitionProps) {
  const [lottieData, setLottieData] = useState<object | null>(null)
  const [avatarLottieData, setAvatarLottieData] = useState<object | null>(null)

  // Load Lottie animation data
  useEffect(() => {
    if (!animation) return

    if (animation.type === 'lottie') {
      fetch(animation.src)
        .then(res => res.json())
        .then(data => setLottieData(data))
        .catch(err => console.error('Failed to load Lottie animation:', err))
    } else if (animation.type === 'countup' && animation.avatarAnimation) {
      fetch(animation.avatarAnimation.src)
        .then(res => res.json())
        .then(data => setAvatarLottieData(data))
        .catch(err => console.error('Failed to load avatar animation:', err))
    }
  }, [animation])

  const renderAnimation = () => {
    if (!animation) return null

    switch (animation.type) {
      case 'lottie':
        // За body-scan анимация - показваме специална визуализация за телесни показатели
        if (animation.src?.includes('body-scan')) {
          return <BodyMetricsVisual />
        }
        // За healthy-lifestyle анимация - показваме визуализация за навици
        if (animation.src?.includes('healthy-lifestyle')) {
          return <LifestyleHabitsVisual />
        }
        // За success-confetti анимация - показваме визуализация за завършване
        if (animation.src?.includes('success-confetti')) {
          return <SuccessCompletionVisual />
        }
        // За други Lottie анимации
        if (!lottieData) return null
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <Lottie
              animationData={lottieData}
              loop={animation.loop ?? true}
              autoplay={animation.autoplay ?? true}
              style={animation.style}
            />
          </motion.div>
        )

      case 'chart':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <TimelineChart
              xAxis={animation.data.xAxis}
              yAxis={animation.data.yAxis}
              color={animation.data.color}
              gradient={animation.data.gradient}
              animationDuration={animation.animationDuration}
            />
          </motion.div>
        )

      case 'countup':
        return (
          <div className="mb-8">
            <SocialProofGrid count={animation.targetNumber} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      {/* Въпрос - скрит за countup анимации (текстът е в SocialProofGrid) */}
      {animation?.type !== 'countup' && (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground"
        >
          {question}
        </motion.h2>
      )}

      {/* Описание - скрито за countup анимации (текстът е в SocialProofGrid) */}
      {animation?.type !== 'countup' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base text-foreground/70 text-center mb-6"
        >
          {description}
        </motion.p>
      )}

      {/* Анимация */}
      {renderAnimation()}
    </motion.div>
  )
}

// Компонент за Timeline Chart - Професионална версия
function TimelineChart({
  xAxis,
  yAxis,
  color,
  gradient,
  animationDuration = 2000,
}: {
  xAxis: string[]
  yAxis: number[]
  color: string
  gradient?: boolean
  animationDuration?: number
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let startTime: number | null = null
    let animationId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      setAnimatedProgress(progress)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [animationDuration])

  // Milestones за визуализация
  const milestones = [
    { day: 0, label: 'Старт', description: 'Начало на програмата' },
    { day: 30, label: 'Ден 30', description: 'Първи резултати' },
    { day: 60, label: 'Ден 60', description: 'Значително подобрение' },
    { day: 90, label: 'Ден 90', description: 'Оптимални нива' },
  ]

  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-foreground mb-1">
          Очакван прогрес
        </h3>
        <p className="text-xs text-muted-foreground">
          Базирано на резултати от хиляди мъже
        </p>
      </div>

      {/* Chart container */}
      <div className="relative bg-gradient-to-b from-muted/30 to-background rounded-2xl p-4 border border-border">
        {/* Y-axis labels */}
        <div className="absolute left-2 top-4 bottom-16 flex flex-col justify-between text-[10px] text-muted-foreground">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 mr-2">
          {/* Grid lines */}
          <div className="relative h-40">
            {[0, 25, 50, 75].map((line) => (
              <div
                key={line}
                className="absolute w-full border-t border-dashed border-border/50"
                style={{ top: `${100 - line}%` }}
              />
            ))}

            {/* Progress line with gradient */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              {/* Gradient definition */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area under curve */}
              <path
                d={`
                  M 0 ${160 - (yAxis[0] / 100) * 160 * animatedProgress}
                  ${yAxis.map((value, i) => {
                    const x = (i / (yAxis.length - 1)) * 100
                    const y = 160 - (value / 100) * 160 * animatedProgress
                    return `L ${x}% ${y}`
                  }).join(' ')}
                  L 100% 160
                  L 0 160
                  Z
                `}
                fill="url(#areaGradient)"
              />

              {/* Main line */}
              <path
                d={`
                  M 0 ${160 - (yAxis[0] / 100) * 160 * animatedProgress}
                  ${yAxis.map((value, i) => {
                    const x = (i / (yAxis.length - 1)) * 100
                    const y = 160 - (value / 100) * 160 * animatedProgress
                    return `L ${x}% ${y}`
                  }).join(' ')}
                `}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {yAxis.map((value, i) => {
                const x = (i / (yAxis.length - 1)) * 100
                const y = 160 - (value / 100) * 160 * animatedProgress
                const isFirst = i === 0
                return (
                  <g key={i}>
                    {/* Outer ring */}
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r={isFirst ? 10 : 6}
                      fill={isFirst ? '#ef4444' : color}
                      opacity={animatedProgress > i / (yAxis.length - 1) ? 1 : 0}
                    />
                    {/* Inner dot */}
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r={isFirst ? 5 : 3}
                      fill="white"
                      opacity={animatedProgress > i / (yAxis.length - 1) ? 1 : 0}
                    />
                    {/* Value label */}
                    {animatedProgress > i / (yAxis.length - 1) && (
                      <text
                        x={`${x}%`}
                        y={y - 15}
                        textAnchor="middle"
                        className="text-[10px] font-bold"
                        fill={isFirst ? '#ef4444' : color}
                      >
                        {Math.round(value * animatedProgress)}%
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* "You are here" indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute left-0 flex items-center gap-1"
              style={{ top: `${100 - yAxis[0]}%`, transform: 'translateY(-50%)' }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                Вие сте тук
              </span>
            </motion.div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-3 pt-2 border-t border-border">
            {milestones.map((milestone, i) => (
              <motion.div
                key={milestone.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-xs font-semibold text-foreground">
                  {milestone.label}
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {milestone.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 grid grid-cols-3 gap-2 text-center"
      >
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-lg font-bold" style={{ color }}>+{Math.round((yAxis[yAxis.length - 1] - yAxis[0]) * animatedProgress)}%</div>
          <div className="text-[9px] text-muted-foreground">Подобрение</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-lg font-bold text-foreground">90</div>
          <div className="text-[9px] text-muted-foreground">Дни</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-lg font-bold text-green-500">97%</div>
          <div className="text-[9px] text-muted-foreground">Успеваемост</div>
        </div>
      </motion.div>
    </div>
  )
}

// Компонент за визуализация на телесни показатели
function BodyMetricsVisual() {
  const metrics = [
    {
      icon: Ruler,
      label: 'Височина',
      description: 'Изчисляване на BMI',
      color: '#3B82F6',
      delay: 0,
    },
    {
      icon: Scale,
      label: 'Тегло',
      description: 'Мускулна vs мастна маса',
      color: '#10B981',
      delay: 0.1,
    },
    {
      icon: Activity,
      label: 'Мазнини',
      description: 'Телесен състав',
      color: '#F59E0B',
      delay: 0.2,
    },
    {
      icon: Heart,
      label: 'Метаболизъм',
      description: 'Връзка с енергията',
      color: '#EF4444',
      delay: 0.3,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-8"
    >
      {/* 3D anatomical body with scan effect */}
      <div className="relative flex justify-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* 3D body image */}
          <div className="relative w-40 h-56 rounded-2xl overflow-hidden">
            <Image
              src="/images/body-scan-3d.webp"
              alt="Body scan"
              fill
              className="object-contain"
              priority
            />

            {/* Scanning line effect */}
            <motion.div
              className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
              style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.9), 0 0 60px rgba(16, 185, 129, 0.5)' }}
              initial={{ top: 0 }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Scan glow overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-emerald-500/15 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

        </motion.div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + metric.delay, duration: 0.4 }}
            className="bg-muted/30 rounded-xl p-3 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">
                  {metric.label}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {metric.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Тези данни ще помогнат да персонализираме Вашата програма
        </p>
      </motion.div>
    </motion.div>
  )
}

// Компонент за визуализация на навици (стрес, сън, алкохол и др.)
function LifestyleHabitsVisual() {
  const habits = [
    {
      icon: Moon,
      label: 'Сън',
      description: 'Качество и продължителност',
      color: '#6366F1',
      delay: 0,
    },
    {
      icon: Brain,
      label: 'Стрес',
      description: 'Ежедневен натиск',
      color: '#EC4899',
      delay: 0.1,
    },
    {
      icon: Wine,
      label: 'Алкохол',
      description: 'Честота на употреба',
      color: '#F59E0B',
      delay: 0.2,
    },
    {
      icon: Cigarette,
      label: 'Тютюн',
      description: 'Влияние върху здравето',
      color: '#EF4444',
      delay: 0.3,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-8"
    >
      {/* Central visual - Balance/Lifestyle icon */}
      <div className="relative flex justify-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Circular progress visual */}
          <div className="relative w-36 h-36">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted/30"
              />
              {/* Animated progress arcs for each habit */}
              {habits.map((habit, index) => {
                const rotation = index * 90 - 90
                const dashArray = 66 // 1/4 of circumference (approx)
                return (
                  <motion.circle
                    key={habit.label}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={habit.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${dashArray} 264`}
                    initial={{ strokeDashoffset: dashArray }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ delay: 0.3 + habit.delay, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: '50% 50%',
                    }}
                  />
                )
              })}
            </svg>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Floating habit icons around the circle */}
          {habits.map((habit, index) => {
            const angle = (index * 90 - 45) * (Math.PI / 180)
            const radius = 75
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            return (
              <motion.div
                key={habit.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + habit.delay, type: 'spring' }}
                className="absolute w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  left: `calc(50% + ${x}px - 20px)`,
                  top: `calc(50% + ${y}px - 20px)`,
                  backgroundColor: `${habit.color}20`,
                  border: `2px solid ${habit.color}`,
                }}
              >
                <habit.icon className="w-5 h-5" style={{ color: habit.color }} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Habits grid */}
      <div className="grid grid-cols-2 gap-3">
        {habits.map((habit) => (
          <motion.div
            key={habit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + habit.delay, duration: 0.4 }}
            className="bg-muted/30 rounded-xl p-3 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <habit.icon className="w-4 h-4" style={{ color: habit.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">
                  {habit.label}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {habit.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Анализираме как навиците Ви влияят на хормоналния баланс
        </p>
      </motion.div>
    </motion.div>
  )
}

// Компонент за визуализация на завършване на quiz-а
function SuccessCompletionVisual() {
  const completedSteps = [
    {
      icon: Target,
      label: 'Симптоми',
      description: 'Анализирани',
      color: '#10B981',
      delay: 0,
    },
    {
      icon: Activity,
      label: 'Тяло',
      description: 'Измерено',
      color: '#3B82F6',
      delay: 0.1,
    },
    {
      icon: Utensils,
      label: 'Хранене',
      description: 'Оценено',
      color: '#F59E0B',
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      label: 'План',
      description: 'Готов',
      color: '#8B5CF6',
      delay: 0.3,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-8"
    >
      {/* Central success visual */}
      <div className="relative flex justify-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          {/* Glowing background */}
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-xl" />

          {/* Main trophy circle */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            >
              <Trophy className="w-14 h-14 text-white" />
            </motion.div>

            {/* Sparkle effects */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={angle}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute w-3 h-3"
                style={{
                  left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 70}px - 6px)`,
                  top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 70}px - 6px)`,
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-emerald-500/50"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Progress bar showing 100% complete */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: '100%' }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Анализ завършен</span>
          <span className="text-sm font-bold text-emerald-500">100%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Completed steps grid */}
      <div className="grid grid-cols-2 gap-3">
        {completedSteps.map((step) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + step.delay, duration: 0.4 }}
            className="bg-muted/30 rounded-xl p-3 border border-border"
          >
            <div className="flex items-start gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${step.color}20` }}
              >
                <step.icon className="w-4 h-4" style={{ color: step.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    {step.label}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {step.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-4 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Вашият план е готов</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
