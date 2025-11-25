'use client'

/**
 * Nutrition Page - Bento Grid Layout
 * Modern meal plan tracking with Bento Grid design
 * Now with dietary preference substitutions
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, TrendingUp, Leaf, Droplets, Plus, Minus, Drumstick, Wheat, Droplet } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'
import { MealCard } from '@/components/dashboard/MealCard'
import { useUserProgram } from '@/contexts/UserProgramContext'
import { useToast } from '@/contexts/ToastContext'
import { applyDaySubstitutions, type SubstitutedMeal, type SubstitutedIngredient } from '@/lib/utils/dietary-substitution'
import type { DietaryPreference } from '@/lib/data/dietary-substitutions'
import { useWeeklyCompletion } from '@/lib/hooks/useWeeklyCompletion'
import { SkeletonHeroBanner, SkeletonMealCard, SkeletonWeeklyCalendar, SkeletonStatBox } from '@/components/ui/skeleton-card'
import mealImagesMapping from '@/lib/data/meal-images-mapping.json'

// Meal Plan Imports - LOW level
import { ENERGY_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-low'
import { LIBIDO_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-low'
import { MUSCLE_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-low'

// Meal Plan Imports - NORMAL level
import { ENERGY_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-normal'
import { LIBIDO_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-normal'
import { MUSCLE_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-normal'

// Meal Plan Imports - HIGH level
import { ENERGY_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-high'
import { LIBIDO_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-high'
import { MUSCLE_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-high'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  first_name?: string
  profile_picture_url?: string
  program_start_date?: string
  dietary_preference?: DietaryPreference
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

// Helper function to get meal plan based on category and level
function getMealPlanForCategory(
  category: 'energy' | 'libido' | 'muscle',
  level: string = 'normal'
) {
  const normalizedLevel = level.toLowerCase()

  if (category === 'energy') {
    if (normalizedLevel === 'low') return ENERGY_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return ENERGY_HIGH_MEAL_PLAN
    return ENERGY_NORMAL_MEAL_PLAN
  } else if (category === 'libido') {
    if (normalizedLevel === 'low') return LIBIDO_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return LIBIDO_HIGH_MEAL_PLAN
    return LIBIDO_NORMAL_MEAL_PLAN
  } else {
    if (normalizedLevel === 'low') return MUSCLE_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return MUSCLE_HIGH_MEAL_PLAN
    return MUSCLE_NORMAL_MEAL_PLAN
  }
}

// Helper function to get image URL for a meal name
function getMealImageUrl(mealName: string): string | undefined {
  // Create slug from meal name (same logic as in generation script)
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
    'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya'
  }

  const slug = mealName
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const mapping = mealImagesMapping as Record<string, { imageUrl: string }>
  return mapping[slug]?.imageUrl
}

export default function NutritionPage() {
  const router = useRouter()
  const toast = useToast()
  const { email, userProgram, loading: contextLoading } = useUserProgram()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>()
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [completedMeals, setCompletedMeals] = useState<Record<string, number[]>>({})
  const [substitutedMeals, setSubstitutedMeals] = useState<Record<string, Record<number, SubstitutedMeal>>>({})
  const [substitutingMeals, setSubstitutingMeals] = useState<Record<string, boolean>>({})
  const [waterGlasses, setWaterGlasses] = useState<Record<string, number>>({})
  const [updatingWater, setUpdatingWater] = useState(false)

  // Load weekly completion status for calendar
  const { completedDates } = useWeeklyCompletion(selectedDate, email)

  // Water target based on category and level (glasses per day, 1 glass = 250ml)
  const getWaterTarget = (category: string, level: string): number => {
    const targets: Record<string, Record<string, number>> = {
      energy: { low: 8, normal: 10, high: 12 },    // 2L, 2.5L, 3L
      muscle: { low: 10, normal: 12, high: 14 },   // 2.5L, 3L, 3.5L
      libido: { low: 8, normal: 10, high: 12 },    // 2L, 2.5L, 3L
    }
    return targets[category]?.[level.toLowerCase()] || 10
  }

  // Load user program
  useEffect(() => {
    const loadUserProgram = async () => {
      if (!email || contextLoading) return

      try {
        // Set user name from Context
        if (userProgram) {
          if (userProgram.first_name) {
            setUserName(userProgram.first_name)
          } else {
            const emailUsername = email.split('@')[0]
            setUserName(emailUsername)
          }

          // Set program start date
          if (userProgram.program_start_date) {
            setProgramStartDate(new Date(userProgram.program_start_date))
          }
        }

        // Fetch today's completed meals
        const today = new Date().toISOString().split('T')[0]
        const mealsResponse = await fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${today}`)
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          const dateKey = today
          setCompletedMeals({
            [dateKey]: mealsData.completedMeals || []
          })
        }
      } catch (error) {
        console.error('Error loading program:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProgram()
  }, [email, userProgram, contextLoading])

  // Load meals and substitutions for selected date
  useEffect(() => {
    const loadMealsForDate = async () => {
      if (!email) return

      const dateKey = selectedDate.toISOString().split('T')[0]

      // Load completed meals
      const mealsResponse = await fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${dateKey}`)
      if (mealsResponse.ok) {
        const mealsData = await mealsResponse.json()
        setCompletedMeals(prev => ({
          ...prev,
          [dateKey]: mealsData.completedMeals || []
        }))
      }

      // Load meal substitutions
      const subsResponse = await fetch(`/api/meals/substitutions?email=${encodeURIComponent(email)}&date=${dateKey}`)
      if (subsResponse.ok) {
        const subsData = await subsResponse.json()
        setSubstitutedMeals(prev => ({
          ...prev,
          [dateKey]: subsData.substitutions || {}
        }))
      }

      // Load water tracking
      const waterResponse = await fetch(`/api/water/track?date=${dateKey}`)
      if (waterResponse.ok) {
        const waterData = await waterResponse.json()
        setWaterGlasses(prev => ({
          ...prev,
          [dateKey]: waterData.glasses || 0
        }))
      }
    }

    loadMealsForDate()
  }, [selectedDate, email])

  const handleMealToggle = async (mealNumber: number) => {
    if (!email) return

    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentMeals = completedMeals[dateKey] || []
    const isCompleted = currentMeals.includes(mealNumber)

    try {
      // Always send POST request - API will toggle the state
      const response = await fetch('/api/meals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          date: dateKey,
          mealNumber,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle meal')
      }

      // Update local state based on previous state
      if (isCompleted) {
        // Was completed, now uncomplete
        setCompletedMeals({
          ...completedMeals,
          [dateKey]: currentMeals.filter(m => m !== mealNumber)
        })
      } else {
        // Was not completed, now complete
        setCompletedMeals({
          ...completedMeals,
          [dateKey]: [...currentMeals, mealNumber]
        })
      }
    } catch (error) {
      console.error('Error toggling meal:', error)
      toast.error('Не успяхме да запазим промяната. Моля опитайте отново.')
    }
  }

  const handleUndo = async (mealNumber: number) => {
    if (!email) return

    const dateKey = selectedDate.toISOString().split('T')[0]

    try {
      // Delete substitution from database
      const response = await fetch(
        `/api/meals/substitutions?email=${encodeURIComponent(email)}&date=${dateKey}&mealNumber=${mealNumber}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to undo substitution')
      }

      // Remove substituted meal to restore original
      setSubstitutedMeals(prev => {
        const updated = { ...prev }
        if (updated[dateKey]) {
          const { [mealNumber]: _removed, ...rest } = updated[dateKey]
          if (Object.keys(rest).length === 0) {
            delete updated[dateKey]
          } else {
            updated[dateKey] = rest
          }
        }
        return updated
      })
    } catch (error) {
      console.error('Error undoing substitution:', error)
      toast.error('Не успяхме да възстановим оригиналната храна. Моля опитайте отново.')
    }
  }

  const handleSubstitute = async (meal: SubstitutedMeal) => {
    if (!userProgram) return

    const dateKey = selectedDate.toISOString().split('T')[0]
    const mealKey = `${dateKey}-${meal.meal_number}`

    // Set loading state
    setSubstitutingMeals(prev => ({ ...prev, [mealKey]: true }))

    try {
      const response = await fetch('/api/meals/substitute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMealName: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          mealNumber: meal.meal_number,
          time: meal.time,
          dietaryPreference: userProgram.dietary_preference || 'omnivor',
          category: userProgram.category,
          level: userProgram.level,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to substitute meal')
      }

      const data = await response.json()
      const newMeal: SubstitutedMeal = {
        meal_number: meal.meal_number,
        time: meal.time,
        name: data.meal.name,
        calories: data.meal.calories,
        protein: data.meal.protein,
        carbs: data.meal.carbs,
        fats: data.meal.fats,
        ingredients: data.meal.ingredients.map((ing: SubstitutedIngredient) => ({
          ...ing,
          substituted: true,
        })),
        recipe: data.meal.recipe,
        substitution_count: (meal.substitution_count || 0) + 1,
        name_updated: true,
      }

      // Save substitution to database
      if (email) {
        await fetch('/api/meals/substitutions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            date: dateKey,
            mealNumber: meal.meal_number,
            substitutedMeal: newMeal,
          }),
        })
      }

      // Update substituted meals state
      setSubstitutedMeals(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [meal.meal_number]: newMeal,
        },
      }))
    } catch (error) {
      console.error('Error substituting meal:', error)
      toast.error('Не успяхме да заменим храната. Моля опитайте отново.')
    } finally {
      // Clear loading state
      setSubstitutingMeals(prev => {
        const updated = { ...prev }
        delete updated[mealKey]
        return updated
      })
    }
  }

  const handleWaterUpdate = async (delta: number) => {
    if (!email || updatingWater) return

    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentGlasses = waterGlasses[dateKey] || 0
    const newGlasses = Math.max(0, Math.min(20, currentGlasses + delta))

    if (newGlasses === currentGlasses) return

    setUpdatingWater(true)

    // Optimistic update
    setWaterGlasses(prev => ({
      ...prev,
      [dateKey]: newGlasses
    }))

    try {
      const response = await fetch('/api/water/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey, glasses: newGlasses }),
      })

      if (!response.ok) {
        // Revert on error
        setWaterGlasses(prev => ({
          ...prev,
          [dateKey]: currentGlasses
        }))
        throw new Error('Failed to update water')
      }
    } catch (error) {
      console.error('Error updating water:', error)
      toast.error('Грешка при запазване на водата')
    } finally {
      setUpdatingWater(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
        <TopNav programName="Хранене" userName={userName} />
        <div className="container-mobile py-6 pb-24 space-y-4">
          {/* Hero Skeleton */}
          <SkeletonHeroBanner />
          {/* Calendar Skeleton */}
          <SkeletonWeeklyCalendar />
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <SkeletonStatBox />
            <SkeletonStatBox />
          </div>
          {/* Meal Cards Skeleton */}
          <div className="space-y-3">
            <SkeletonMealCard />
            <SkeletonMealCard />
            <SkeletonMealCard />
            <SkeletonMealCard />
            <SkeletonMealCard />
          </div>
        </div>
        <BottomNav onNavigate={() => router.push('/app')} />
      </div>
    )
  }

  if (!userProgram) return null

  const programName = CATEGORY_NAMES[userProgram.category]
  const mealPlan = getMealPlanForCategory(userProgram.category, userProgram.level)

  const selectedDayOfWeek = selectedDate.getDay()
  const dayData = mealPlan?.meals.find(
    (m) => m.day_of_week === (selectedDayOfWeek === 0 ? 7 : selectedDayOfWeek)
  )
  const originalMeals = dayData?.meals || []

  // Apply dietary substitutions if needed
  const dietaryPreference = userProgram.dietary_preference || 'omnivor'
  const baseMeals: SubstitutedMeal[] = dietaryPreference !== 'omnivor'
    ? applyDaySubstitutions(originalMeals, dietaryPreference)
    : originalMeals.map(meal => ({
        ...meal,
        substitution_count: 0,
        name_updated: false,
        ingredients: meal.ingredients.map(ing => ({
          ...ing,
          substituted: false
        }))
      }))

  const dateKey = selectedDate.toISOString().split('T')[0]

  // Merge AI-substituted meals
  const substitutedForToday = substitutedMeals[dateKey] || {}
  const mealsForDay: SubstitutedMeal[] = baseMeals.map(meal =>
    substitutedForToday[meal.meal_number] || meal
  )

  const completedToday = completedMeals[dateKey] || []

  // Calculate TARGET values from all meals for the day
  const targetCalories = mealsForDay.reduce((sum, meal) => sum + meal.calories, 0)
  const targetProtein = mealsForDay.reduce((sum, meal) => sum + meal.protein, 0)
  const targetCarbs = mealsForDay.reduce((sum, meal) => sum + meal.carbs, 0)
  const targetFats = mealsForDay.reduce((sum, meal) => sum + meal.fats, 0)

  // Calculate CONSUMED values from completed meals only
  const totalCalories = mealsForDay
    .filter(meal => completedToday.includes(meal.meal_number))
    .reduce((sum, meal) => sum + meal.calories, 0)

  const totalProtein = mealsForDay
    .filter(meal => completedToday.includes(meal.meal_number))
    .reduce((sum, meal) => sum + meal.protein, 0)

  const totalCarbs = mealsForDay
    .filter(meal => completedToday.includes(meal.meal_number))
    .reduce((sum, meal) => sum + meal.carbs, 0)

  const totalFats = mealsForDay
    .filter(meal => completedToday.includes(meal.meal_number))
    .reduce((sum, meal) => sum + meal.fats, 0)

  // Calculate percentages
  const caloriesPercent = targetCalories > 0 ? Math.round((totalCalories / targetCalories) * 100) : 0
  const proteinPercent = targetProtein > 0 ? Math.round((totalProtein / targetProtein) * 100) : 0
  const carbsPercent = targetCarbs > 0 ? Math.round((totalCarbs / targetCarbs) * 100) : 0
  const fatsPercent = targetFats > 0 ? Math.round((totalFats / targetFats) * 100) : 0

  // Water tracking
  const waterTarget = getWaterTarget(userProgram.category, userProgram.level)
  const currentWater = waterGlasses[dateKey] || 0
  const waterPercent = waterTarget > 0 ? Math.round((currentWater / waterTarget) * 100) : 0
  const waterMl = currentWater * 250
  const waterTargetMl = waterTarget * 250

  // Dietary preference display names
  const dietaryPreferenceNames: Record<DietaryPreference, string> = {
    omnivor: 'Omnivore',
    pescatarian: 'Pescatarian',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan'
  }

  const hasDietarySubstitutions = dietaryPreference !== 'omnivor'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <TopNav
        programName={programName}
        userName={userName}
        profilePictureUrl={userProgram?.profile_picture_url}
      />

      <div className="container-mobile py-6 pb-24 space-y-4">
        {/* Dietary Preference Badge (if active) */}
        {hasDietarySubstitutions && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
            <div className="p-2 rounded-lg bg-green-100">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                {dietaryPreferenceNames[dietaryPreference]} План
              </p>
              <p className="text-xs text-green-700">
                Съставките са адаптирани според твоите предпочитания
              </p>
            </div>
          </div>
        )}

        {/* Page Title + Mini Progress */}
        <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-xl font-bold px-1">Хранителен План</h1>

          {/* Mini Progress */}
          <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2 border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-primary">{completedToday.length}/{mealsForDay.length}</span>
              <span className="text-[10px] text-muted-foreground">хранения</span>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <WeeklyCalendar
            programStartDate={programStartDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            completedDates={completedDates}
          />
        </div>

        {/* Bento Grid - Stats */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {/* Water Tracking - Compact Full Row */}
          <div
            className="col-span-4 flex items-center justify-between bg-cyan-500/10 rounded-xl px-3 py-2.5 border border-cyan-500/20 animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium">Вода</span>
              <span className="text-lg font-bold text-cyan-600">{currentWater}/{waterTarget}</span>
              <span className="text-[10px] text-muted-foreground">Чаша 250мл.</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleWaterUpdate(-1)}
                disabled={updatingWater || currentWater <= 0}
                className="p-1 rounded-md hover:bg-cyan-500/20 transition-colors disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5 text-cyan-600" />
              </button>
              <button
                onClick={() => handleWaterUpdate(1)}
                disabled={updatingWater || currentWater >= 20}
                className="p-1.5 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Calories */}
          <div
            className="relative bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-medium text-orange-500">{caloriesPercent}%</span>
            </div>
            <div className="text-xl font-bold mb-0.5">
              <span className="text-foreground">{totalCalories}</span>
              <span className="text-muted-foreground font-normal text-sm">/{targetCalories}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Калории</div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(caloriesPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div
            className="relative bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Drumstick className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-medium text-red-500">{proteinPercent}%</span>
            </div>
            <div className="text-xl font-bold mb-0.5">
              <span className="text-foreground">{totalProtein}</span>
              <span className="text-muted-foreground font-normal text-sm">/{targetProtein}g</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Протеин</div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${Math.min(proteinPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div
            className="relative bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Wheat className="w-4 h-4 text-yellow-600" />
              <span className="text-[10px] font-medium text-yellow-600">{carbsPercent}%</span>
            </div>
            <div className="text-xl font-bold mb-0.5">
              <span className="text-foreground">{totalCarbs}</span>
              <span className="text-muted-foreground font-normal text-sm">/{targetCarbs}g</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Въгл.</div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-600 transition-all duration-500"
                style={{ width: `${Math.min(carbsPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div
            className="relative bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-medium text-blue-500">{fatsPercent}%</span>
            </div>
            <div className="text-xl font-bold mb-0.5">
              <span className="text-foreground">{totalFats}</span>
              <span className="text-muted-foreground font-normal text-sm">/{targetFats}g</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Мазнини</div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(fatsPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-3">
          <h3
            className="font-bold text-lg px-1 animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            Твоите хранения
          </h3>

          {mealsForDay.map((meal, index) => {
            const isCompleted = completedToday.includes(meal.meal_number)

            return (
              <div
                key={meal.meal_number}
                className="animate-fade-in"
                style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'both' }}
              >
                <MealCard
                  mealNumber={meal.meal_number}
                  time={meal.time}
                  name={meal.name}
                  calories={meal.calories}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fats={meal.fats}
                  ingredients={meal.ingredients}
                  recipe={meal.recipe}
                  isCompleted={isCompleted}
                  onToggleComplete={() => handleMealToggle(meal.meal_number)}
                  onSubstitute={() => handleSubstitute(meal)}
                  onUndo={() => handleUndo(meal.meal_number)}
                  isSubstituting={substitutingMeals[`${dateKey}-${meal.meal_number}`] || false}
                  isSubstituted={!!substitutedForToday[meal.meal_number]}
                  imageUrl={getMealImageUrl(meal.name)}
                />
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
