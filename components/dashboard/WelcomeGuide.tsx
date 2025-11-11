'use client'

/**
 * Welcome Guide - First-time user onboarding
 * Shows only on first login
 */

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Check, Calendar, Utensils, Dumbbell, Pill } from 'lucide-react'

interface WelcomeGuideProps {
  userName?: string
  onComplete: () => void
}

export function WelcomeGuide({ userName, onComplete }: WelcomeGuideProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: <Calendar className="w-12 h-12 text-primary" />,
      title: 'Добре дошли в Testograph!',
      description: userName
        ? `${userName}, започваш своята 30-дневна програма за оптимизация на тестостерона.`
        : 'Започваш своята 30-дневна програма за оптимизация на тестостерона.',
      tips: [
        'Персонализирана програма според твоя тест',
        'Дневни хранителни препоръки',
        'Тренировки и добавки',
      ],
    },
    {
      icon: <Utensils className="w-12 h-12 text-primary" />,
      title: 'Хранителен план',
      description: 'Всеки ден ще имаш готов хранителен план с точни калории и макроси.',
      tips: [
        'Маркирай храненията като завършени',
        'Виж пълните рецепти и съставки',
        'Следи своя прогрес',
      ],
    },
    {
      icon: <Dumbbell className="w-12 h-12 text-primary" />,
      title: 'Тренировки',
      description: 'Специално подбрани упражнения за повишаване на тестостерона.',
      tips: [
        'Видеа с техника на изпълнение',
        'Персонализиран график',
        'Проследяване на прогреса',
      ],
    },
    {
      icon: <Pill className="w-12 h-12 text-primary" />,
      title: 'TestoUp добавка',
      description: 'Маркирай приемането на добавката 2 пъти дневно за оптимални резултати.',
      tips: [
        'Сутрин след закуска',
        'Вечер след вечеря',
        'Редовността е ключова',
      ],
    },
  ]

  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border border-border overflow-hidden shimmer-effect spotlight-effect animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors hover-lift ripple-effect"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              {currentStep.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-3">
            {currentStep.title}
          </h2>

          {/* Description */}
          <p className="text-center text-muted-foreground mb-6">
            {currentStep.description}
          </p>

          {/* Tips */}
          <div className="space-y-3 mb-8">
            {currentStep.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === step
                    ? 'w-8 bg-primary'
                    : index < step
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isLastStep && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 hover-lift ripple-effect"
              >
                Пропусни
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 hover-lift ripple-effect">
              {isLastStep ? 'Започни' : 'Напред'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
