/**
 * Dietary Substitutions Mapping
 * Maps animal-based ingredients to plant-based alternatives
 * Preserves similar macros (protein, carbs, fats, calories)
 */

export type DietaryPreference = 'omnivor' | 'pescatarian' | 'vegetarian' | 'vegan'

export interface Substitution {
  name: string
  /** Approximate protein per 100g */
  protein_per_100g?: number
  /** Approximate calories per 100g */
  calories_per_100g?: number
  /** Additional notes about the substitution */
  note?: string
}

export interface IngredientSubstitutions {
  /** Original ingredient name */
  original: string
  /** Substitution for pescatarians (no meat, but fish/seafood OK) */
  pescatarian?: Substitution
  /** Substitution for vegetarians (no meat/fish, but eggs/dairy OK) */
  vegetarian?: Substitution
  /** Substitution for vegans (100% plant-based) */
  vegan?: Substitution
}

/**
 * Comprehensive ingredient substitution map
 * Organized by ingredient category
 */
export const DIETARY_SUBSTITUTIONS: IngredientSubstitutions[] = [
  // ============================================
  // CHICKEN & POULTRY
  // ============================================
  {
    original: 'Пилешки гърди',
    pescatarian: {
      name: 'Филе от сьомга',
      protein_per_100g: 20,
      calories_per_100g: 206,
      note: 'Високо съдържание на протеин и Omega-3',
    },
    vegetarian: {
      name: 'Тофу (екстра твърдо)',
      protein_per_100g: 15,
      calories_per_100g: 145,
      note: 'Отличен източник на протеин',
    },
    vegan: {
      name: 'Тофу (екстра твърдо)',
      protein_per_100g: 15,
      calories_per_100g: 145,
      note: 'Отличен източник на протеин',
    },
  },
  {
    original: 'Пилешки филе',
    pescatarian: {
      name: 'Филе от треска',
      protein_per_100g: 18,
      calories_per_100g: 82,
      note: 'Нискокалоричен протеин',
    },
    vegetarian: {
      name: 'Темпе',
      protein_per_100g: 19,
      calories_per_100g: 193,
      note: 'Ферментирана соя, лесно смилаема',
    },
    vegan: {
      name: 'Темпе',
      protein_per_100g: 19,
      calories_per_100g: 193,
      note: 'Ферментирана соя, лесно смилаема',
    },
  },
  {
    original: 'Пуешко филе',
    pescatarian: {
      name: 'Филе от тон',
      protein_per_100g: 30,
      calories_per_100g: 144,
      note: 'Много висок протеин',
    },
    vegetarian: {
      name: 'Сейтан (пшеничен глутен)',
      protein_per_100g: 25,
      calories_per_100g: 370,
      note: 'Най-близък до месна текстура',
    },
    vegan: {
      name: 'Сейтан (пшеничен глутен)',
      protein_per_100g: 25,
      calories_per_100g: 370,
      note: 'Най-близък до месна текстура',
    },
  },

  // ============================================
  // RED MEAT (BEEF, PORK, LAMB)
  // ============================================
  {
    original: 'Телешко месо',
    pescatarian: {
      name: 'Филе от сьомга',
      protein_per_100g: 20,
      calories_per_100g: 206,
    },
    vegetarian: {
      name: 'Портобело гъби + Сейтан (50/50)',
      protein_per_100g: 15,
      calories_per_100g: 180,
      note: 'Комбинация за текстура и вкус',
    },
    vegan: {
      name: 'Портобело гъби + Сейтан (50/50)',
      protein_per_100g: 15,
      calories_per_100g: 180,
      note: 'Комбинация за текстура и вкус',
    },
  },
  {
    original: 'Свинско месо',
    pescatarian: {
      name: 'Скариди',
      protein_per_100g: 24,
      calories_per_100g: 99,
    },
    vegetarian: {
      name: 'Темпе + гъби',
      protein_per_100g: 17,
      calories_per_100g: 170,
    },
    vegan: {
      name: 'Темпе + гъби',
      protein_per_100g: 17,
      calories_per_100g: 170,
    },
  },
  {
    original: 'Агнешко месо',
    pescatarian: {
      name: 'Филе от бяла риба',
      protein_per_100g: 20,
      calories_per_100g: 90,
    },
    vegetarian: {
      name: 'Леща + киноа',
      protein_per_100g: 12,
      calories_per_100g: 160,
      note: 'Пълноценен протеин',
    },
    vegan: {
      name: 'Леща + киноа',
      protein_per_100g: 12,
      calories_per_100g: 160,
      note: 'Пълноценен протеин',
    },
  },

  // ============================================
  // FISH & SEAFOOD
  // ============================================
  {
    original: 'Сьомга',
    pescatarian: {
      name: 'Сьомга',
      protein_per_100g: 20,
      calories_per_100g: 206,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Тофу + 1 с.л. ленено семе',
      protein_per_100g: 16,
      calories_per_100g: 190,
      note: 'Добавя Omega-3',
    },
    vegan: {
      name: 'Тофу + 1 с.л. ленено семе',
      protein_per_100g: 16,
      calories_per_100g: 190,
      note: 'Добавя Omega-3',
    },
  },
  {
    original: 'Треска',
    pescatarian: {
      name: 'Треска',
      protein_per_100g: 18,
      calories_per_100g: 82,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Тофу (нискокалоричен)',
      protein_per_100g: 15,
      calories_per_100g: 76,
    },
    vegan: {
      name: 'Тофу (нискокалоричен)',
      protein_per_100g: 15,
      calories_per_100g: 76,
    },
  },
  {
    original: 'Тон',
    pescatarian: {
      name: 'Тон',
      protein_per_100g: 30,
      calories_per_100g: 144,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Нахут (протеинов изолат)',
      protein_per_100g: 19,
      calories_per_100g: 364,
    },
    vegan: {
      name: 'Нахут (протеинов изолат)',
      protein_per_100g: 19,
      calories_per_100g: 364,
    },
  },
  {
    original: 'Скариди',
    pescatarian: {
      name: 'Скариди',
      protein_per_100g: 24,
      calories_per_100g: 99,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Тофу + соев сос',
      protein_per_100g: 15,
      calories_per_100g: 150,
    },
    vegan: {
      name: 'Тофу + соев сос',
      protein_per_100g: 15,
      calories_per_100g: 150,
    },
  },

  // ============================================
  // EGGS & DAIRY
  // ============================================
  {
    original: 'Яйца',
    pescatarian: {
      name: 'Яйца',
      protein_per_100g: 13,
      calories_per_100g: 155,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Яйца',
      protein_per_100g: 13,
      calories_per_100g: 155,
      note: 'Същата съставка',
    },
    vegan: {
      name: 'Тофу scramble',
      protein_per_100g: 15,
      calories_per_100g: 145,
      note: 'Размачкано тофу със зеленчуци',
    },
  },
  {
    original: 'Извара',
    pescatarian: {
      name: 'Извара',
      protein_per_100g: 11,
      calories_per_100g: 98,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Извара',
      protein_per_100g: 11,
      calories_per_100g: 98,
      note: 'Същата съставка',
    },
    vegan: {
      name: 'Кашу ядки (кеш масло)',
      protein_per_100g: 18,
      calories_per_100g: 553,
      note: 'Богат на протеин и мазнини',
    },
  },
  {
    original: 'Кисело мляко',
    pescatarian: {
      name: 'Кисело мляко',
      protein_per_100g: 3.5,
      calories_per_100g: 61,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Кисело мляко',
      protein_per_100g: 3.5,
      calories_per_100g: 61,
      note: 'Същата съставка',
    },
    vegan: {
      name: 'Соево кисело мляко',
      protein_per_100g: 3.3,
      calories_per_100g: 47,
      note: 'Растително алтернатива',
    },
  },
  {
    original: 'Мляко',
    pescatarian: {
      name: 'Мляко',
      protein_per_100g: 3.4,
      calories_per_100g: 42,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Мляко',
      protein_per_100g: 3.4,
      calories_per_100g: 42,
      note: 'Същата съставка',
    },
    vegan: {
      name: 'Соево мляко',
      protein_per_100g: 3.3,
      calories_per_100g: 33,
      note: 'Най-близък по протеин',
    },
  },
  {
    original: 'Сирене',
    pescatarian: {
      name: 'Сирене',
      protein_per_100g: 17,
      calories_per_100g: 264,
      note: 'Същата съставка',
    },
    vegetarian: {
      name: 'Сирене',
      protein_per_100g: 17,
      calories_per_100g: 264,
      note: 'Същата съставка',
    },
    vegan: {
      name: 'Веган сирене (кеш основа)',
      protein_per_100g: 10,
      calories_per_100g: 270,
    },
  },
  {
    original: 'Протеинов шейк',
    pescatarian: {
      name: 'Суроватъчен протеин',
      protein_per_100g: 80,
      calories_per_100g: 400,
      note: 'Млечен източник',
    },
    vegetarian: {
      name: 'Суроватъчен протеин',
      protein_per_100g: 80,
      calories_per_100g: 400,
      note: 'Млечен източник',
    },
    vegan: {
      name: 'Растителен протеин (грах)',
      protein_per_100g: 80,
      calories_per_100g: 390,
      note: 'Веган алтернатива',
    },
  },

  // ============================================
  // LEGUMES & PLANT PROTEINS (No substitution needed)
  // ============================================
  {
    original: 'Леща',
    pescatarian: {
      name: 'Леща',
      protein_per_100g: 9,
      calories_per_100g: 116,
      note: 'Растителен протеин',
    },
    vegetarian: {
      name: 'Леща',
      protein_per_100g: 9,
      calories_per_100g: 116,
      note: 'Растителен протеин',
    },
    vegan: {
      name: 'Леща',
      protein_per_100g: 9,
      calories_per_100g: 116,
      note: 'Растителен протеин',
    },
  },
  {
    original: 'Нахут',
    pescatarian: {
      name: 'Нахут',
      protein_per_100g: 19,
      calories_per_100g: 364,
      note: 'Растителен протеин',
    },
    vegetarian: {
      name: 'Нахут',
      protein_per_100g: 19,
      calories_per_100g: 364,
      note: 'Растителен протеин',
    },
    vegan: {
      name: 'Нахут',
      protein_per_100g: 19,
      calories_per_100g: 364,
      note: 'Растителен протеин',
    },
  },
  {
    original: 'Боб',
    pescatarian: {
      name: 'Боб',
      protein_per_100g: 21,
      calories_per_100g: 347,
      note: 'Растителен протеин',
    },
    vegetarian: {
      name: 'Боб',
      protein_per_100g: 21,
      calories_per_100g: 347,
      note: 'Растителен протеин',
    },
    vegan: {
      name: 'Боб',
      protein_per_100g: 21,
      calories_per_100g: 347,
      note: 'Растителен протеин',
    },
  },

  // ============================================
  // GRAINS & CARBS (No substitution needed)
  // ============================================
  {
    original: 'Кафяв ориз',
    pescatarian: {
      name: 'Кафяв ориз',
      protein_per_100g: 2.6,
      calories_per_100g: 111,
    },
    vegetarian: {
      name: 'Кафяв ориз',
      protein_per_100g: 2.6,
      calories_per_100g: 111,
    },
    vegan: {
      name: 'Кафяв ориз',
      protein_per_100g: 2.6,
      calories_per_100g: 111,
    },
  },
  {
    original: 'Киноа',
    pescatarian: {
      name: 'Киноа',
      protein_per_100g: 4.4,
      calories_per_100g: 120,
    },
    vegetarian: {
      name: 'Киноа',
      protein_per_100g: 4.4,
      calories_per_100g: 120,
    },
    vegan: {
      name: 'Киноа',
      protein_per_100g: 4.4,
      calories_per_100g: 120,
    },
  },
  {
    original: 'Овесени ядки',
    pescatarian: {
      name: 'Овесени ядки',
      protein_per_100g: 2.4,
      calories_per_100g: 68,
    },
    vegetarian: {
      name: 'Овесени ядки',
      protein_per_100g: 2.4,
      calories_per_100g: 68,
    },
    vegan: {
      name: 'Овесени ядки',
      protein_per_100g: 2.4,
      calories_per_100g: 68,
    },
  },

  // ============================================
  // VEGETABLES (No substitution needed)
  // ============================================
  {
    original: 'Броколи',
    pescatarian: {
      name: 'Броколи',
      protein_per_100g: 2.8,
      calories_per_100g: 34,
    },
    vegetarian: {
      name: 'Броколи',
      protein_per_100g: 2.8,
      calories_per_100g: 34,
    },
    vegan: {
      name: 'Броколи',
      protein_per_100g: 2.8,
      calories_per_100g: 34,
    },
  },
  {
    original: 'Моркови',
    pescatarian: {
      name: 'Моркови',
      protein_per_100g: 0.9,
      calories_per_100g: 41,
    },
    vegetarian: {
      name: 'Моркови',
      protein_per_100g: 0.9,
      calories_per_100g: 41,
    },
    vegan: {
      name: 'Моркови',
      protein_per_100g: 0.9,
      calories_per_100g: 41,
    },
  },
  {
    original: 'Спанак',
    pescatarian: {
      name: 'Спанак',
      protein_per_100g: 2.9,
      calories_per_100g: 23,
    },
    vegetarian: {
      name: 'Спанак',
      protein_per_100g: 2.9,
      calories_per_100g: 23,
    },
    vegan: {
      name: 'Спанак',
      protein_per_100g: 2.9,
      calories_per_100g: 23,
    },
  },

  // ============================================
  // FATS & OILS (No substitution needed)
  // ============================================
  {
    original: 'Зехтин',
    pescatarian: {
      name: 'Зехтин',
      protein_per_100g: 0,
      calories_per_100g: 884,
    },
    vegetarian: {
      name: 'Зехтин',
      protein_per_100g: 0,
      calories_per_100g: 884,
    },
    vegan: {
      name: 'Зехтин',
      protein_per_100g: 0,
      calories_per_100g: 884,
    },
  },
  {
    original: 'Авокадо',
    pescatarian: {
      name: 'Авокадо',
      protein_per_100g: 2,
      calories_per_100g: 160,
    },
    vegetarian: {
      name: 'Авокадо',
      protein_per_100g: 2,
      calories_per_100g: 160,
    },
    vegan: {
      name: 'Авокадо',
      protein_per_100g: 2,
      calories_per_100g: 160,
    },
  },
  {
    original: 'Бадеми',
    pescatarian: {
      name: 'Бадеми',
      protein_per_100g: 21,
      calories_per_100g: 579,
    },
    vegetarian: {
      name: 'Бадеми',
      protein_per_100g: 21,
      calories_per_100g: 579,
    },
    vegan: {
      name: 'Бадеми',
      protein_per_100g: 21,
      calories_per_100g: 579,
    },
  },
]

/**
 * Helper function to find substitution for an ingredient
 * @param ingredientName - Name of the ingredient to substitute
 * @param preference - User's dietary preference
 * @returns Substitution object or null if no substitution found
 */
export function findSubstitution(
  ingredientName: string,
  preference: DietaryPreference
): Substitution | null {
  // Omnivor doesn't need substitutions
  if (preference === 'omnivor') {
    return null
  }

  // Normalize ingredient name (lowercase, trim)
  const normalized = ingredientName.toLowerCase().trim()

  // Find matching substitution
  const match = DIETARY_SUBSTITUTIONS.find((sub) => sub.original.toLowerCase() === normalized)

  if (!match) {
    return null
  }

  // Return the appropriate substitution based on preference
  return match[preference] || null
}

/**
 * Get all unique ingredient names that have substitutions
 */
export function getAllSubstitutableIngredients(): string[] {
  return DIETARY_SUBSTITUTIONS.map((sub) => sub.original)
}
