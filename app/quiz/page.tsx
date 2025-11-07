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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset flex flex-col">
      <div className="container-mobile py-4 space-y-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold leading-tight">
            Безплатен тест за{' '}
            <span className="text-primary">тестостерон</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Открий къде е проблемът и получи персонализирана програма
          </p>
        </div>

        {/* Category Selection */}
        <div className="space-y-3 flex-1">
          <h2 className="text-base font-semibold text-center">
            Избери фокусна област
          </h2>

          <div className="space-y-2">
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
          className="group mt-auto"
        >
          Започни теста
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
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
        w-full p-3 rounded-lg border-2 transition-all text-left
        ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
        }
      `}
      style={{
        boxShadow: isSelected ? `0 0 0 2px ${category.color}20` : 'none',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Emoji Icon */}
        <div
          className="text-2xl p-2 rounded-lg flex-shrink-0"
          style={{
            backgroundColor: isSelected ? `${category.color}20` : 'transparent',
          }}
        >
          {category.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-0.5">{category.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {category.description}
          </p>
        </div>

        {/* Checkmark */}
        {isSelected && (
          <CheckCircle2
            className="w-5 h-5 flex-shrink-0"
            style={{ color: category.color }}
          />
        )}
      </div>
    </button>
  )
}
