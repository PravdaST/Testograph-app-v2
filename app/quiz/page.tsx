'use client'

/**
 * Quiz Landing Page - Category Selection
 * User chooses which category quiz to take
 */

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllCategories, type CategoryInfo } from '@/lib/data/quiz'
import { LogIn } from 'lucide-react'

export default function QuizLandingPage() {
  const router = useRouter()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset flex flex-col">
      <div className="container-mobile py-4 space-y-4 flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Image
              src="/testograph_black_logo.png"
              alt="Testograph"
              width={180}
              height={60}
              priority
              className="dark:invert"
            />
          </div>

          <h1 className="text-2xl font-bold leading-tight">
            Безплатен тест за{' '}
            <span className="text-primary">тестостерон</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Открий къде е проблемът и получи персонализирана програма
          </p>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-center">
            Избери фокусна област
          </h2>

          <div className="space-y-2">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onSelect={() => router.push(`/quiz/${category.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Вече имам акаунт
          </Link>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({
  category,
  onSelect,
}: {
  category: CategoryInfo
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full p-3 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent/5 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        {/* Emoji Icon */}
        <div className="text-2xl p-2 rounded-lg flex-shrink-0">
          {category.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-0.5">{category.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {category.description}
          </p>
        </div>
      </div>
    </button>
  )
}
