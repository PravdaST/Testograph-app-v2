/**
 * Program Context Builder for AI Coach
 *
 * Provides full access to user's program: meals, workouts, and alternatives
 */

// Import all meal plans
import { ENERGY_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-low'
import { ENERGY_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-normal'
import { ENERGY_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-high'
import { LIBIDO_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-low'
import { LIBIDO_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-normal'
import { LIBIDO_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-high'
import { MUSCLE_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-low'
import { MUSCLE_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-normal'
import { MUSCLE_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-high'

// Import all workout plans - GYM
import { ENERGY_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-low-gym'
import { ENERGY_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-normal-gym'
import { ENERGY_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-high-gym'
import { LIBIDO_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-low-gym'
import { LIBIDO_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-normal-gym'
import { LIBIDO_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-high-gym'
import { MUSCLE_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-low-gym'
import { MUSCLE_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-normal-gym'
import { MUSCLE_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-high-gym'

// Import all workout plans - HOME
import { ENERGY_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-low-home'
import { ENERGY_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-normal-home'
import { ENERGY_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-high-home'
import { LIBIDO_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-low-home'
import { LIBIDO_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-normal-home'
import { LIBIDO_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-high-home'
import { MUSCLE_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-low-home'
import { MUSCLE_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-normal-home'
import { MUSCLE_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-high-home'

// Meal plan mapping
const MEAL_PLANS: Record<string, typeof ENERGY_NORMAL_MEAL_PLAN> = {
  'energy-low': ENERGY_LOW_MEAL_PLAN,
  'energy-normal': ENERGY_NORMAL_MEAL_PLAN,
  'energy-high': ENERGY_HIGH_MEAL_PLAN,
  'libido-low': LIBIDO_LOW_MEAL_PLAN,
  'libido-normal': LIBIDO_NORMAL_MEAL_PLAN,
  'libido-high': LIBIDO_HIGH_MEAL_PLAN,
  'muscle-low': MUSCLE_LOW_MEAL_PLAN,
  'muscle-normal': MUSCLE_NORMAL_MEAL_PLAN,
  'muscle-high': MUSCLE_HIGH_MEAL_PLAN,
}

// Workout plan mapping - GYM
const GYM_WORKOUTS: Record<string, typeof ENERGY_NORMAL_GYM_WORKOUTS> = {
  'energy-low': ENERGY_LOW_GYM_WORKOUTS,
  'energy-normal': ENERGY_NORMAL_GYM_WORKOUTS,
  'energy-high': ENERGY_HIGH_GYM_WORKOUTS,
  'libido-low': LIBIDO_LOW_GYM_WORKOUTS,
  'libido-normal': LIBIDO_NORMAL_GYM_WORKOUTS,
  'libido-high': LIBIDO_HIGH_GYM_WORKOUTS,
  'muscle-low': MUSCLE_LOW_GYM_WORKOUTS,
  'muscle-normal': MUSCLE_NORMAL_GYM_WORKOUTS,
  'muscle-high': MUSCLE_HIGH_GYM_WORKOUTS,
}

// Workout plan mapping - HOME
const HOME_WORKOUTS: Record<string, typeof ENERGY_NORMAL_HOME_WORKOUTS> = {
  'energy-low': ENERGY_LOW_HOME_WORKOUTS,
  'energy-normal': ENERGY_NORMAL_HOME_WORKOUTS,
  'energy-high': ENERGY_HIGH_HOME_WORKOUTS,
  'libido-low': LIBIDO_LOW_HOME_WORKOUTS,
  'libido-normal': LIBIDO_NORMAL_HOME_WORKOUTS,
  'libido-high': LIBIDO_HIGH_HOME_WORKOUTS,
  'muscle-low': MUSCLE_LOW_HOME_WORKOUTS,
  'muscle-normal': MUSCLE_NORMAL_HOME_WORKOUTS,
  'muscle-high': MUSCLE_HIGH_HOME_WORKOUTS,
}

export interface MealInfo {
  meal_number: number
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: { name: string; quantity: string }[]
}

export interface ExerciseInfo {
  name_bg: string
  name_en: string
  sets: number
  reps: number | string
  rest_seconds: number
  notes?: string
}

export interface WorkoutInfo {
  name: string
  duration: number
  exercises: ExerciseInfo[]
}

export interface ProgramContext {
  todayMeals: MealInfo[]
  todayWorkout: WorkoutInfo | null
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFats: number
}

/**
 * Get today's day of week (1=Monday, 7=Sunday)
 */
function getTodayDayOfWeek(): number {
  const day = new Date().getDay()
  // Convert from Sunday=0 to Monday=1 format
  return day === 0 ? 7 : day
}

/**
 * Get meal plan for user's category and level
 */
function getMealPlan(category: string, level: string) {
  const key = `${category}-${level}`
  return MEAL_PLANS[key] || MEAL_PLANS['energy-normal']
}

/**
 * Get workout plan for user's category, level, and location
 */
function getWorkoutPlan(category: string, level: string, location: 'home' | 'gym') {
  const key = `${category}-${level}`
  if (location === 'home') {
    return HOME_WORKOUTS[key] || HOME_WORKOUTS['energy-normal']
  }
  return GYM_WORKOUTS[key] || GYM_WORKOUTS['energy-normal']
}

/**
 * Get full program context for today
 */
export function getProgramContext(
  category: string,
  level: string,
  workoutLocation: 'home' | 'gym'
): ProgramContext {
  const dayOfWeek = getTodayDayOfWeek()

  // Get meal plan
  const mealPlan = getMealPlan(category, level)
  const todayMealDay = mealPlan.meals.find(d => d.day_of_week === dayOfWeek)

  const todayMeals: MealInfo[] = todayMealDay?.meals.map(m => ({
    meal_number: m.meal_number,
    time: m.time,
    name: m.name,
    calories: m.calories,
    protein: m.protein,
    carbs: m.carbs,
    fats: m.fats,
    ingredients: m.ingredients.map(i => ({ name: i.name, quantity: i.quantity })),
  })) || []

  // Calculate daily totals
  const dailyCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0)
  const dailyProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0)
  const dailyCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0)
  const dailyFats = todayMeals.reduce((sum, m) => sum + m.fats, 0)

  // Get workout plan
  const workoutPlan = getWorkoutPlan(category, level, workoutLocation)
  const todayWorkoutDay = workoutPlan.find(w => w.day_of_week === dayOfWeek)

  const todayWorkout: WorkoutInfo | null = todayWorkoutDay ? {
    name: todayWorkoutDay.name,
    duration: todayWorkoutDay.duration,
    exercises: todayWorkoutDay.exercises.map(e => ({
      name_bg: e.name_bg,
      name_en: e.name_en,
      sets: e.sets,
      reps: e.reps,
      rest_seconds: e.rest_seconds,
      notes: e.notes,
    })),
  } : null

  return {
    todayMeals,
    todayWorkout,
    dailyCalories,
    dailyProtein,
    dailyCarbs,
    dailyFats,
  }
}

/**
 * Build program context prompt for AI Coach
 */
export function buildProgramContextPrompt(context: ProgramContext): string {
  const dayNames = ['', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя']
  const todayName = dayNames[getTodayDayOfWeek()]

  let prompt = `
═══════════════════════════════════════════════
ДНЕШНА ПРОГРАМА НА ПОТРЕБИТЕЛЯ (${todayName})
═══════════════════════════════════════════════

📊 ДНЕВНИ МАКРОСИ:
• Калории: ${context.dailyCalories} kcal
• Протеин: ${context.dailyProtein}g
• Въглехидрати: ${context.dailyCarbs}g
• Мазнини: ${context.dailyFats}g

🍽️ ХРАНИТЕЛЕН ПЛАН ЗА ДНЕС:
`

  for (const meal of context.todayMeals) {
    const mealNames = ['', 'Закуска', 'Междинна закуска', 'Обяд', 'Следобедна закуска', 'Вечеря']
    prompt += `
${mealNames[meal.meal_number]} (${meal.time}): ${meal.name}
  • Калории: ${meal.calories} | П: ${meal.protein}g | В: ${meal.carbs}g | М: ${meal.fats}g
  • Съставки: ${meal.ingredients.map(i => `${i.name} (${i.quantity})`).join(', ')}
`
  }

  if (context.todayWorkout) {
    prompt += `
💪 ТРЕНИРОВКА ЗА ДНЕС: ${context.todayWorkout.name} (${context.todayWorkout.duration} мин)
`
    for (const ex of context.todayWorkout.exercises) {
      prompt += `
• ${ex.name_bg} (${ex.name_en})
  - ${ex.sets} серии × ${ex.reps} повторения
  - Почивка: ${ex.rest_seconds}s
  ${ex.notes ? `- Съвет: ${ex.notes}` : ''}
`
    }
  } else {
    prompt += `
💪 ТРЕНИРОВКА ЗА ДНЕС: Почивен ден (активно възстановяване)
`
  }

  prompt += `
═══════════════════════════════════════════════
ВАЖНО ЗА ОТГОВОРИТЕ:
1. Когато потребителят пита за храната си - използвай ТОЧНО тези ястия и съставки
2. Когато пита за тренировката - обяснявай КОНКРЕТНИТЕ упражнения от плана
3. Можеш да даваш алтернативи ако потребителят поиска (напр. заместители за съставки, алтернативни упражнения)
4. Помагай с техника на упражненията и съвети за готвене
5. Ако потребителят пита "какво да ям", кажи му точно кое ястие е следващото според часа
═══════════════════════════════════════════════
`

  return prompt
}
