'use client'

/**
 * Quiz Landing Page - Category Selection
 * User chooses which category quiz to take
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { getAllCategories, type CategoryInfo } from '@/lib/data/quiz'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function QuizLandingPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = getAllCategories()

  const handleStart = () => {
    if (!selectedCategory) {
      alert('Моля избери категория')
      return
    }

    // Navigate to category quiz (email will be captured there)
    router.push(`/quiz/${selectedCategory}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <div className="container-mobile py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Безплатен тест за{' '}
            <span className="text-primary">тестостерон</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Открий къде е проблемът и получи персонализирана 28-дневна програма
          </p>
        </div>

        {/* Category Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Избери фокусна област
          </h2>

          <div className="space-y-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          size="lg"
          fullWidth
          onClick={handleStart}
          disabled={!selectedCategory}
          className="group"
        >
          Започни теста
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Trust Signals */}
        <div className="pt-6 border-t border-border space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              13 научно базирани въпроса - 5 минути
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Персонализирана оценка според възраст и цели
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Безплатен детайлен PDF отчет
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({
  category,
  isSelected,
  onSelect,
}: {
  category: CategoryInfo
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-5 rounded-xl border-2 transition-all text-left
        ${
          isSelected
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
        }
      `}
      style={{
        boxShadow: isSelected ? `0 0 0 3px ${category.color}20` : 'none',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Emoji Icon */}
        <div
          className="text-4xl p-3 rounded-lg"
          style={{
            backgroundColor: isSelected ? `${category.color}20` : 'transparent',
          }}
        >
          {category.emoji}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {category.description}
          </p>

          {/* Focus Areas */}
          <div className="flex flex-wrap gap-2">
            {category.focusAreas.map((area, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-muted"
                style={{
                  color: isSelected ? category.color : undefined,
                  backgroundColor: isSelected ? `${category.color}15` : undefined,
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Checkmark */}
        {isSelected && (
          <CheckCircle2
            className="w-6 h-6 flex-shrink-0"
            style={{ color: category.color }}
          />
        )}
      </div>
    </button>
  )
}
