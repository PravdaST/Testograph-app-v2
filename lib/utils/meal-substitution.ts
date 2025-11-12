import type { SubstitutedMeal } from './dietary-substitution'

interface MealPlan {
  meals: Array<{
    day_of_week: number
    meals: SubstitutedMeal[]
  }>
}

/**
 * Find a suitable meal substitute from the existing meal plan
 * @param currentMeal - The meal to substitute
 * @param mealPlan - The complete meal plan
 * @param calorieThreshold - Acceptable calorie difference (default 100)
 * @returns A random suitable meal or null if none found
 */
export function findMealSubstitute(
  currentMeal: SubstitutedMeal,
  mealPlan: MealPlan,
  calorieThreshold: number = 100
): SubstitutedMeal | null {
  // Collect all meals from all 7 days
  const allMeals: SubstitutedMeal[] = []

  for (const day of mealPlan.meals) {
    // Only get meals with the same meal_number (same time of day)
    const mealsForSameTime = day.meals.filter(
      meal => meal.meal_number === currentMeal.meal_number
    )
    allMeals.push(...mealsForSameTime)
  }

  // Filter suitable substitutes
  const suitableMeals = allMeals.filter(meal => {
    // Must be different from current meal
    if (meal.name === currentMeal.name) return false

    // Must have similar calories (±threshold)
    const calorieDiff = Math.abs(meal.calories - currentMeal.calories)
    if (calorieDiff > calorieThreshold) return false

    return true
  })

  // Return random meal from suitable options
  if (suitableMeals.length === 0) return null

  const randomIndex = Math.floor(Math.random() * suitableMeals.length)
  return suitableMeals[randomIndex]
}

/**
 * Get time category for a meal number
 * Used to group meals by time of day
 */
export function getMealTimeCategory(mealNumber: number): string {
  if (mealNumber === 1) return 'breakfast'
  if (mealNumber === 2 || mealNumber === 4) return 'snack'
  if (mealNumber === 3) return 'lunch'
  if (mealNumber === 5) return 'dinner'
  return 'other'
}
