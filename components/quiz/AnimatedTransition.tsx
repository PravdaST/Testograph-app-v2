'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import CountUp from 'react-countup'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import type { AnimationConfig } from '@/lib/data/quiz/types'

// Dynamic import за Lottie (за да не натоварваме bundle-а)
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface AnimatedTransitionProps {
  question: string
  description: string
  animation?: AnimationConfig
  onContinue: () => void
  dynamicCopy?: Array<{
    condition: string
    text: string
  }>
}

export function AnimatedTransition({
  question,
  description,
  animation,
  onContinue,
  dynamicCopy,
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
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="flex flex-col items-center gap-6 mb-8"
          >
            <div style={animation.style} className="text-center">
              <CountUp
                start={0}
                end={animation.targetNumber}
                duration={animation.duration ?? 2.5}
                separator=","
                prefix={animation.prefix}
                suffix={animation.suffix}
              />
            </div>
            {animation.avatarAnimation && avatarLottieData && (
              <Lottie
                animationData={avatarLottieData}
                loop={animation.avatarAnimation.loop ?? false}
                autoplay
                style={animation.avatarAnimation.style}
              />
            )}
          </motion.div>
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
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* Анимация */}
      {renderAnimation()}

      {/* Въпрос */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground"
      >
        {question}
      </motion.h2>

      {/* Описание */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-lg text-foreground/80 text-center mb-8"
      >
        {description}
      </motion.p>

      {/* Динамично съдържание (ако има) */}
      {dynamicCopy && dynamicCopy.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-muted/30 rounded-2xl p-6 mb-8 border border-primary/20"
        >
          <p className="text-base leading-relaxed">
            {dynamicCopy[0].text}
          </p>
        </motion.div>
      )}

      {/* Бутон за продължаване */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5, type: 'spring' }}
        className="flex justify-center"
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="group px-8 py-6 text-lg font-semibold"
        >
          Напред
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

// Компонент за Timeline Chart
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 400

    const padding = 60
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    let progress = 0
    const animate = () => {
      progress += 1 / (animationDuration / 16.67) // 60 FPS

      if (progress > 1) progress = 1

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background if enabled
      if (gradient) {
        const gradientBg = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradientBg.addColorStop(0, `${color}10`)
        gradientBg.addColorStop(1, `${color}00`)
        ctx.fillStyle = gradientBg
        ctx.fillRect(padding, padding, chartWidth, chartHeight)
      }

      // Draw axes
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.stroke()

      // Draw X-axis labels
      ctx.fillStyle = '#6b7280'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      xAxis.forEach((label, i) => {
        const x = padding + (chartWidth / (xAxis.length - 1)) * i
        ctx.fillText(label + ' дни', x, canvas.height - padding + 30)
      })

      // Draw Y-axis label
      ctx.save()
      ctx.translate(20, canvas.height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('Индекс на Енергията (%)', 0, 0)
      ctx.restore()

      // Draw line with animation
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      yAxis.forEach((value, i) => {
        const x = padding + (chartWidth / (yAxis.length - 1)) * i

        // Animate progress
        const animatedValue = value * progress

        const animatedY =
          canvas.height - padding - (animatedValue / 100) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, animatedY)
        } else {
          ctx.lineTo(x, animatedY)
        }
      })
      ctx.stroke()

      // Draw dots
      ctx.fillStyle = color
      yAxis.forEach((value, i) => {
        if (i / (yAxis.length - 1) <= progress) {
          const x = padding + (chartWidth / (yAxis.length - 1)) * i
          const animatedValue = value * (i === yAxis.length - 1 ? progress : 1)
          const y =
            canvas.height - padding - (animatedValue / 100) * chartHeight

          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Current position marker
      if (progress > 0) {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(padding, canvas.height - padding - (40 * progress / 100) * chartHeight, 8, 0, Math.PI * 2)
        ctx.fill()
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [xAxis, yAxis, color, gradient, animationDuration])

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-center mb-4">
        Очакван Прогрес на Енергийното Възстановяване
      </h3>
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ maxWidth: '800px', height: 'auto' }}
      />
    </div>
  )
}
