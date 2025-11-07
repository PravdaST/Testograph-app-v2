/**
 * Mock Meal Plan Data
 * Temporary data for UI testing before database is populated
 * Based on ПРОГРАМИ-БЪЛГАРСКИ.md
 */

export const MOCK_MEAL_PLAN = {
  program_id: 'libido-low',
  program_name: 'Либидо - Ниско ниво',

  // Week meals (repeating every 7 days)
  meals: [
    // Monday (day 1)
    {
      day_of_week: 1,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Бъркани яйца с авокадо',
          calories: 620,
          protein: 32,
          carbs: 45,
          fats: 35,
          ingredients: [
            { name: 'Яйца', quantity: '3 бр', calories: 234 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 160 },
            { name: 'Пълнозърнест хляб', quantity: '2 филии', calories: 226 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Протеинов шейк с банан',
          calories: 350,
          protein: 30,
          carbs: 40,
          fats: 8,
          ingredients: [
            { name: 'Протеинов прах', quantity: '30г', calories: 120 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Мляко', quantity: '250мл', calories: 125 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Пилешки гърди с киноа',
          calories: 580,
          protein: 45,
          carbs: 50,
          fats: 18,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '150г', calories: 248 },
            { name: 'Киноа', quantity: '100г (сух)', calories: 220 },
            { name: 'Зеленчуци', quantity: '150г', calories: 112 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Кисело мляко с ядки',
          calories: 280,
          protein: 18,
          carbs: 22,
          fats: 15,
          ingredients: [
            { name: 'Кисело мляко', quantity: '200г', calories: 130 },
            { name: 'Бадеми', quantity: '30г', calories: 170 },
            { name: 'Мед', quantity: '1 ч.л.', calories: 21 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Сьомга с броколи',
          calories: 520,
          protein: 42,
          carbs: 28,
          fats: 28,
          ingredients: [
            { name: 'Сьомга', quantity: '150г', calories: 312 },
            { name: 'Броколи', quantity: '200г', calories: 68 },
            { name: 'Маслинено масло', quantity: '1 с.л.', calories: 140 },
          ],
        },
      ],
    },

    // Tuesday (day 2)
    {
      day_of_week: 2,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Овесена каша с протеин',
          calories: 480,
          protein: 28,
          carbs: 58,
          fats: 14,
          ingredients: [
            { name: 'Овесени ядки', quantity: '80г', calories: 303 },
            { name: 'Протеинов прах', quantity: '20г', calories: 80 },
            { name: 'Боровинки', quantity: '50г', calories: 29 },
            { name: 'Бадемово мляко', quantity: '200мл', calories: 68 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Домашен протеинов бар',
          calories: 320,
          protein: 22,
          carbs: 35,
          fats: 10,
          ingredients: [
            { name: 'Протеинов бар', quantity: '1 бр', calories: 320 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Говеждо със зеленчуци',
          calories: 620,
          protein: 48,
          carbs: 42,
          fats: 25,
          ingredients: [
            { name: 'Говеждо месо', quantity: '150г', calories: 312 },
            { name: 'Кафяв ориз', quantity: '80г (сух)', calories: 285 },
            { name: 'Микс зеленчуци', quantity: '150г', calories: 23 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Микс от ядки (кашу и орехи)',
          calories: 260,
          protein: 12,
          carbs: 28,
          fats: 13,
          ingredients: [
            { name: 'Кашу', quantity: '100г', calories: 160 },
            { name: 'Орехи', quantity: '20г', calories: 130 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Риба тон с аспержи',
          calories: 440,
          protein: 45,
          carbs: 18,
          fats: 22,
          ingredients: [
            { name: 'Риба тон', quantity: '150г', calories: 310 },
            { name: 'Аспержи', quantity: '150г', calories: 30 },
            { name: 'Лимон', quantity: '1/2 бр', calories: 12 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 88 },
          ],
        },
      ],
    },

    // Wednesday (day 3)
    {
      day_of_week: 3,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Омлет със спанак',
          calories: 550,
          protein: 35,
          carbs: 42,
          fats: 28,
          ingredients: [
            { name: 'Яйца', quantity: '4 бр', calories: 312 },
            { name: 'Спанак', quantity: '100г', calories: 23 },
            { name: 'Сирене', quantity: '50г', calories: 215 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Ябълка с фъстъчено масло',
          calories: 290,
          protein: 8,
          carbs: 35,
          fats: 16,
          ingredients: [
            { name: 'Ябълка', quantity: '1 бр', calories: 95 },
            { name: 'Фъстъчено масло', quantity: '2 с.л.', calories: 195 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Пуешко месо с батат',
          calories: 590,
          protein: 48,
          carbs: 55,
          fats: 18,
          ingredients: [
            { name: 'Пуешко месо', quantity: '150г', calories: 225 },
            { name: 'Батат', quantity: '200г', calories: 180 },
            { name: 'Зеленчуци', quantity: '150г', calories: 185 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Извара с мед',
          calories: 260,
          protein: 20,
          carbs: 28,
          fats: 8,
          ingredients: [
            { name: 'Извара', quantity: '200г', calories: 220 },
            { name: 'Мед', quantity: '1 с.л.', calories: 40 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Скариди с киноа',
          calories: 480,
          protein: 42,
          carbs: 48,
          fats: 12,
          ingredients: [
            { name: 'Скариди', quantity: '200г', calories: 200 },
            { name: 'Киноа', quantity: '100г', calories: 220 },
            { name: 'Чесън и лимон', quantity: '50г', calories: 60 },
          ],
        },
      ],
    },

    // Thursday (day 4)
    {
      day_of_week: 4,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Протеинови палачинки',
          calories: 520,
          protein: 32,
          carbs: 52,
          fats: 18,
          ingredients: [
            { name: 'Яйца', quantity: '2 бр', calories: 156 },
            { name: 'Протеинов прах', quantity: '30г', calories: 120 },
            { name: 'Овесени ядки', quantity: '50г', calories: 190 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Смути с протеин',
          calories: 380,
          protein: 28,
          carbs: 45,
          fats: 10,
          ingredients: [
            { name: 'Протеинов прах', quantity: '30г', calories: 120 },
            { name: 'Спанак', quantity: '50г', calories: 12 },
            { name: 'Манго', quantity: '100г', calories: 60 },
            { name: 'Бадемово мляко', quantity: '250мл', calories: 85 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Салата с риба тон',
          calories: 560,
          protein: 45,
          carbs: 38,
          fats: 25,
          ingredients: [
            { name: 'Риба тон', quantity: '150г', calories: 310 },
            { name: 'Салата', quantity: '200г', calories: 30 },
            { name: 'Маслини', quantity: '50г', calories: 115 },
            { name: 'Маслинено масло', quantity: '1 с.л.', calories: 105 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Хумус със зеленчуци',
          calories: 280,
          protein: 12,
          carbs: 32,
          fats: 14,
          ingredients: [
            { name: 'Хумус', quantity: '100г', calories: 166 },
            { name: 'Моркови', quantity: '100г', calories: 41 },
            { name: 'Краставици', quantity: '100г', calories: 16 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Печени пилешки бутчета',
          calories: 540,
          protein: 48,
          carbs: 28,
          fats: 26,
          ingredients: [
            { name: 'Пилешки бутчета', quantity: '200г', calories: 380 },
            { name: 'Сладки картофи', quantity: '150г', calories: 135 },
            { name: 'Масло', quantity: '1 ч.л.', calories: 25 },
          ],
        },
      ],
    },

    // Friday (day 5)
    {
      day_of_week: 5,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Кисело мляко с мюсли',
          calories: 490,
          protein: 28,
          carbs: 52,
          fats: 18,
          ingredients: [
            { name: 'Кисело мляко', quantity: '250г', calories: 162 },
            { name: 'Мюсли', quantity: '60г', calories: 240 },
            { name: 'Ягоди', quantity: '100г', calories: 32 },
            { name: 'Мед', quantity: '1 ч.л.', calories: 21 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Сандвич с пуешко',
          calories: 420,
          protein: 32,
          carbs: 45,
          fats: 12,
          ingredients: [
            { name: 'Пълнозърнест хляб', quantity: '2 филии', calories: 160 },
            { name: 'Пуешко месо', quantity: '100г', calories: 150 },
            { name: 'Салата', quantity: '50г', calories: 8 },
            { name: 'Домати', quantity: '50г', calories: 9 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Пиле с ориз и зеленчуци',
          calories: 610,
          protein: 50,
          carbs: 62,
          fats: 16,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '150г', calories: 248 },
            { name: 'Кафяв ориз', quantity: '100г', calories: 356 },
            { name: 'Зеленчуци', quantity: '150г', calories: 75 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Протеиново смути',
          calories: 340,
          protein: 30,
          carbs: 38,
          fats: 8,
          ingredients: [
            { name: 'Протеинов прах', quantity: '30г', calories: 120 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Мляко', quantity: '250мл', calories: 125 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Сьомга на фурна',
          calories: 560,
          protein: 45,
          carbs: 32,
          fats: 28,
          ingredients: [
            { name: 'Сьомга', quantity: '180г', calories: 374 },
            { name: 'Аспержи', quantity: '150г', calories: 30 },
            { name: 'Маслинено масло', quantity: '1 с.л.', calories: 140 },
          ],
        },
      ],
    },

    // Saturday (day 6)
    {
      day_of_week: 6,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Препечени филийки с яйца и авокадо',
          calories: 580,
          protein: 32,
          carbs: 48,
          fats: 28,
          ingredients: [
            { name: 'Пълнозърнест хляб', quantity: '2 филии', calories: 160 },
            { name: 'Яйца', quantity: '3 бр', calories: 234 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 120 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Кисело мляко с орехи и ябълка',
          calories: 315,
          protein: 19,
          carbs: 26,
          fats: 14,
          ingredients: [
            { name: 'Кисело мляко', quantity: '150г', calories: 90 },
            { name: 'Орехи', quantity: '20г', calories: 130 },
            { name: 'Ябълка', quantity: '1 бр', calories: 95 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Спагети с месни кюфтета',
          calories: 640,
          protein: 42,
          carbs: 58,
          fats: 26,
          ingredients: [
            { name: 'Пълнозърнести спагети', quantity: '100г', calories: 350 },
            { name: 'Говеждо месо', quantity: '120г', calories: 250 },
            { name: 'Доматен сос', quantity: '100г', calories: 40 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Плодова салата',
          calories: 260,
          protein: 8,
          carbs: 52,
          fats: 4,
          ingredients: [
            { name: 'Ябълка', quantity: '1 бр', calories: 95 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Портокал', quantity: '1 бр', calories: 62 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Пиле на скара',
          calories: 520,
          protein: 52,
          carbs: 28,
          fats: 22,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '200г', calories: 330 },
            { name: 'Зеленчуци', quantity: '200г', calories: 150 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 88 },
          ],
        },
      ],
    },

    // Sunday (day 7)
    {
      day_of_week: 7,
      meals: [
        {
          meal_number: 1,
          time: '08:00',
          name: 'Овесена каша с ядки',
          calories: 520,
          protein: 22,
          carbs: 58,
          fats: 22,
          ingredients: [
            { name: 'Овесени ядки', quantity: '100г', calories: 379 },
            { name: 'Бадеми', quantity: '30г', calories: 170 },
            { name: 'Мед', quantity: '1 с.л.', calories: 64 },
          ],
        },
        {
          meal_number: 2,
          time: '11:00',
          name: 'Протеинов бар',
          calories: 280,
          protein: 20,
          carbs: 32,
          fats: 8,
          ingredients: [
            { name: 'Протеинов бар', quantity: '1 бр', calories: 280 },
          ],
        },
        {
          meal_number: 3,
          time: '14:00',
          name: 'Пържено пиле с ориз',
          calories: 620,
          protein: 48,
          carbs: 62,
          fats: 18,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '150г', calories: 248 },
            { name: 'Бял ориз', quantity: '100г', calories: 365 },
            { name: 'Соев сос', quantity: '2 с.л.', calories: 20 },
          ],
        },
        {
          meal_number: 4,
          time: '17:00',
          name: 'Кисело мляко с боровинки',
          calories: 310,
          protein: 18,
          carbs: 38,
          fats: 10,
          ingredients: [
            { name: 'Кисело мляко', quantity: '200г', calories: 130 },
            { name: 'Боровинки', quantity: '100г', calories: 57 },
            { name: 'Мед', quantity: '1 с.л.', calories: 64 },
          ],
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Пица с пиле и зеленчуци',
          calories: 590,
          protein: 42,
          carbs: 58,
          fats: 20,
          ingredients: [
            { name: 'Пълнозърнест блат за пица', quantity: '1 бр', calories: 300 },
            { name: 'Пилешко месо', quantity: '100г', calories: 165 },
            { name: 'Зеленчуци', quantity: '100г', calories: 50 },
            { name: 'Сирене', quantity: '30г', calories: 129 },
          ],
        },
      ],
    },
  ],

  // TestoUp schedule (fixed 2× daily)
  testoup: {
    morning: 'след закуска (08:30)',
    evening: 'след вечеря (20:00)',
  },

  // Workout schedule (example for libido-low program)
  workouts: [
    { day_of_week: 1, name: 'Кардио + Долна част', duration: 45 },
    { day_of_week: 2, name: 'Почивка', duration: 0 },
    { day_of_week: 3, name: 'Горна част на тялото', duration: 40 },
    { day_of_week: 4, name: 'Йога / Стречинг', duration: 30 },
    { day_of_week: 5, name: 'Пълно тяло', duration: 45 },
    { day_of_week: 6, name: 'Почивка', duration: 0 },
    { day_of_week: 7, name: 'Лека активност', duration: 20 },
  ],

  // Sleep protocol
  sleep: {
    target_hours: 8,
    bedtime: '22:30',
    wakeup: '06:30',
  },
}
