/**
 * Dietary Substitution Utility
 * Applies ingredient substitutions based on user's dietary preference
 */

import {
  DietaryPreference,
  findSubstitution,
  type Substitution,
} from '@/lib/data/dietary-substitutions'
import type { Recipe } from '@/lib/types/recipe'

// Re-export DietaryPreference for convenience
export type { DietaryPreference }

/**
 * Ingredient structure from meal plans
 */
export interface MealIngredient {
  name: string
  quantity: string
  calories: number
  /** Optional fields for macro tracking */
  protein?: number
  carbs?: number
  fats?: number
}

/**
 * Substituted ingredient with flag and original data
 */
export interface SubstitutedIngredient extends MealIngredient {
  /** Whether this ingredient was substituted */
  substituted: boolean
  /** Original ingredient name (if substituted) */
  original_name?: string
  /** Substitution note/reason */
  substitution_note?: string
}

/**
 * Result of applying dietary substitutions to a meal
 */
export interface SubstitutedMeal {
  meal_number: number
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: SubstitutedIngredient[]
  recipe?: Recipe
  /** Total number of ingredients substituted */
  substitution_count: number
  /** Whether the meal name was updated */
  name_updated: boolean
}

/**
 * Apply dietary substitutions to a single ingredient
 * @param ingredient - Original ingredient
 * @param preference - User's dietary preference
 * @returns Substituted ingredient with metadata
 */
export function applyIngredientSubstitution(
  ingredient: MealIngredient,
  preference: DietaryPreference
): SubstitutedIngredient {
  // Omnivor doesn't need substitutions
  if (preference === 'omnivor') {
    return {
      ...ingredient,
      substituted: false,
    }
  }

  // Try to find a substitution
  const substitution = findSubstitution(ingredient.name, preference)

  // No substitution found - keep original
  if (!substitution) {
    return {
      ...ingredient,
      substituted: false,
    }
  }

  // Calculate adjusted calories based on quantity
  const adjustedCalories = calculateAdjustedCalories(
    ingredient.quantity,
    ingredient.calories,
    substitution
  )

  // Return substituted ingredient
  return {
    name: substitution.name,
    quantity: ingredient.quantity,
    calories: adjustedCalories,
    protein: ingredient.protein,
    carbs: ingredient.carbs,
    fats: ingredient.fats,
    substituted: true,
    original_name: ingredient.name,
    substitution_note: substitution.note,
  }
}

/**
 * Calculate adjusted calories when substituting ingredients
 * Tries to preserve similar calories based on quantity
 */
function calculateAdjustedCalories(
  quantity: string,
  originalCalories: number,
  substitution: Substitution
): number {
  // If substitution has calorie info, try to adjust proportionally
  if (substitution.calories_per_100g) {
    // Extract numeric quantity (rough estimation)
    const match = quantity.match(/(\d+)/)
    if (match) {
      const grams = parseInt(match[1], 10)
      return Math.round((substitution.calories_per_100g * grams) / 100)
    }
  }

  // Fallback: keep original calories
  return originalCalories
}

/**
 * Apply dietary substitutions to all ingredients in a meal
 * @param meal - Original meal data
 * @param preference - User's dietary preference
 * @returns Meal with substituted ingredients
 */
export function applyMealSubstitutions(
  meal: {
    meal_number: number
    time: string
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    ingredients: MealIngredient[]
  },
  preference: DietaryPreference
): SubstitutedMeal {
  // Apply substitutions to all ingredients
  const substitutedIngredients = meal.ingredients.map((ingredient) =>
    applyIngredientSubstitution(ingredient, preference)
  )

  // Count substitutions
  const substitutionCount = substitutedIngredients.filter((i) => i.substituted).length

  // Update meal name if main protein was substituted
  const mainProteinSubstituted = substitutedIngredients[0]?.substituted || false
  let updatedMealName = meal.name
  let nameUpdated = false

  if (mainProteinSubstituted && substitutedIngredients[0].original_name) {
    // Replace original protein name in meal name
    const originalProtein = substitutedIngredients[0].original_name
    const newProtein = substitutedIngredients[0].name

    // Try to intelligently replace protein in meal name
    updatedMealName = meal.name.replace(
      new RegExp(originalProtein, 'gi'),
      newProtein
    )

    // If no replacement happened, append substitution info
    if (updatedMealName === meal.name) {
      updatedMealName = `${meal.name} (с ${newProtein})`
    }

    nameUpdated = updatedMealName !== meal.name
  }

  // Recalculate total calories (sum of all ingredient calories)
  const totalCalories = substitutedIngredients.reduce((sum, ing) => sum + ing.calories, 0)

  return {
    meal_number: meal.meal_number,
    time: meal.time,
    name: updatedMealName,
    calories: totalCalories,
    protein: meal.protein, // Keep original for now (could recalculate)
    carbs: meal.carbs,
    fats: meal.fats,
    ingredients: substitutedIngredients,
    substitution_count: substitutionCount,
    name_updated: nameUpdated,
  }
}

/**
 * Apply dietary substitutions to an entire day of meals
 * @param dayMeals - Array of meals for the day
 * @param preference - User's dietary preference
 * @returns Array of meals with substitutions applied
 */
export function applyDaySubstitutions(
  dayMeals: {
    meal_number: number
    time: string
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    ingredients: MealIngredient[]
  }[],
  preference: DietaryPreference
): SubstitutedMeal[] {
  return dayMeals.map((meal) => applyMealSubstitutions(meal, preference))
}

/**
 * Get summary of substitutions applied
 */
export function getSubstitutionSummary(substitutedMeals: SubstitutedMeal[]): {
  total_substitutions: number
  meals_affected: number
  ingredients_substituted: string[]
} {
  let totalSubstitutions = 0
  let mealsAffected = 0
  const ingredientsSubstituted = new Set<string>()

  substitutedMeals.forEach((meal) => {
    if (meal.substitution_count > 0) {
      mealsAffected++
      totalSubstitutions += meal.substitution_count

      meal.ingredients.forEach((ing) => {
        if (ing.substituted && ing.original_name) {
          ingredientsSubstituted.add(`${ing.original_name} → ${ing.name}`)
        }
      })
    }
  })

  return {
    total_substitutions: totalSubstitutions,
    meals_affected: mealsAffected,
    ingredients_substituted: Array.from(ingredientsSubstituted),
  }
}

/**
 * Check if a dietary preference requires substitutions
 */
export function requiresSubstitutions(preference: DietaryPreference): boolean {
  return preference !== 'omnivor'
}
