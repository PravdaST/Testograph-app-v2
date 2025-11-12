/**
 * ENERGY Program Meal Plan - HIGH Level
 * For users with HIGH energy score (71-100 points)
 * Focus: Maximum performance, fuel intense activity, optimal recovery
 * Calories: 2600-2800 | Protein: 160-170g | Carbs: 300-330g | Fats: 80-90g
 */

import { Recipe, createRecipe } from '../types/recipe'

export const ENERGY_HIGH_MEAL_PLAN = {
  program_id: 'energy-high',
  program_name: 'Енергия и Жизненост - Напреднало ниво',

  meals: [
    // Monday
    {
      day_of_week: 1,
      meals: [
        {
          meal_number: 1,
          time: '06:30',
          name: 'Овесена каша с протеин, банани и ядки',
          calories: 680,
          protein: 32,
          carbs: 92,
          fats: 22,
          ingredients: [
            { name: 'Овесени ядки', quantity: '100г', calories: 380 },
            { name: 'Протеинов прах', quantity: '30г', calories: 120 },
            { name: 'Банан', quantity: '1.5 бр', calories: 158 },
            { name: 'Орехи', quantity: '20г', calories: 131 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Сипете овесените ядки в купичка и ги залейте с 250мл мляко или вода.',
              'Сложете в микровълновата за 2 минути или на котлона за 5 минути при бъркане.',
              'Прибавете протеиновия прах и разбъркайте хубаво.',
              'Нарежете банана на кръгчета и го сложете отгоре.',
              'Поръсете с орехите и полейте с мед.',
            ],
            5,
            5,
            'easy',
            {
              tips: [
                'Протеинът може да стане на буци ако млякото е много горещо',
                'Ако кашата се получи твърде гъста, долей още малко мляко',
              ],
              special_notes: 'Мощна закуска за сериозни тренировки',
              equipment: ['Купичка', 'Микровълнова или котлон'],
            }
          ),
        },
        {
          meal_number: 2,
          time: '09:30',
          name: 'Омлет с авокадо и хляб',
          calories: 560,
          protein: 28,
          carbs: 52,
          fats: 28,
          ingredients: [
            { name: 'Яйца', quantity: '3 бр', calories: 234 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 160 },
            { name: 'Пълнозърнест хляб', quantity: '3 филии', calories: 234 },
          ],
          recipe: createRecipe(
            [
              'Разбийте яйцата в купичка.',
              'Загрейте тиган със зехтин и изсипете яйцата, като ги оставите да се стегнат за 3-4 минути.',
              'Нарежете авокадото на филийки и препечете хляба.',
              'Сложете авокадото върху омлета.',
            ],
            5,
            5,
            'easy',
            {
              tips: ['Не бъркай яйцата много - нека се запекат'],
              special_notes: 'Авокадото дава здравословни мазнини',
            }
          ),
        },
        {
          meal_number: 3,
          time: '12:30',
          name: 'Пиле с кафяв ориз, броколи и сладък картоф',
          calories: 740,
          protein: 58,
          carbs: 86,
          fats: 20,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '220г', calories: 363 },
            { name: 'Кафяв ориз', quantity: '150г сготвен', calories: 188 },
            { name: 'Сладък картоф', quantity: '120г', calories: 108 },
            { name: 'Броколи', quantity: '150г', calories: 51 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 119 },
          ],
          recipe: createRecipe(
            [
              'Сварете ориза по инструкциите на пакета.',
              'Обелете и нарежете сладкия картоф на кубчета и го сварете за 15 минути.',
              'Почистете броколито на розички и го сварете за 8 минути.',
              'Нарежете пилето на парчета и го запържете в зехтин за 6-7 минути от всяка страна.',
              'Сервирайте всичко заедно.',
            ],
            12,
            25,
            'easy',
            {
              tips: ['Кафявият ориз се вари по-дълго от белия'],
              special_notes: 'Пълноценна храна след тежка тренировка',
            }
          ),
        },
        {
          meal_number: 4,
          time: '15:30',
          name: 'Протеинов шейк с овесени ядки и банан',
          calories: 480,
          protein: 38,
          carbs: 64,
          fats: 10,
          ingredients: [
            { name: 'Протеинов прах', quantity: '40г', calories: 160 },
            { name: 'Овесени ядки', quantity: '40г', calories: 152 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Мляко', quantity: '250мл', calories: 125 },
          ],
          recipe: createRecipe(
            [
              'Сложете всички съставки в блендер и миксирайте за 30-40 секунди, докато стане гладко.',
              'Изсипете в шейкър или чаша.',
              'Готово за пиене!',
            ],
            2,
            1,
            'easy',
            {
              tips: [
                'Ако нямаш блендер, стрий овесените ядки на прах преди това',
                'Замразени банани правят шейка по-кремообразен',
              ],
              special_notes: 'Бърза и мощна закуска между тренировките',
            }
          ),
        },
        {
          meal_number: 5,
          time: '18:30',
          name: 'Сьомга с киноа и аспержи',
          calories: 680,
          protein: 52,
          carbs: 58,
          fats: 28,
          ingredients: [
            { name: 'Сьомга', quantity: '200г', calories: 416 },
            { name: 'Киноа', quantity: '150г сготвена', calories: 180 },
            { name: 'Аспержи', quantity: '150г', calories: 30 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Сварете киноата по инструкциите (обикновено 15 мин).',
              'Загрейте фурната на 180°C.',
              'Намажете сьомгата със зехтин, сложете я в тава и я печете 15-18 минути.',
              'Почистете аспержите и ги сварете за 5-6 минути.',
              'Поднесете всичко заедно.',
            ],
            8,
            20,
            'easy',
            {
              tips: [
                'Сьомгата е готова като се разслоява лесно',
                'Киноата е много питателна и лесна за смилане',
              ],
              special_notes: 'Богата на омега-3 и качествени белтъци',
            }
          ),
        },
        {
          meal_number: 6,
          time: '21:00',
          name: 'Извара с орехи и мед',
          calories: 380,
          protein: 26,
          carbs: 36,
          fats: 16,
          ingredients: [
            { name: 'Извара', quantity: '200г', calories: 260 },
            { name: 'Орехи', quantity: '25г', calories: 164 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Извадете изварата в купичка.',
              'Натрошете орехите на едро и ги поръсете върху изварата.',
              'Полейте отгоре с меда.',
            ],
            3,
            0,
            'easy',
            {
              tips: [
                'Изварата е бавноусвояващ се протеин - перфектна за преди лягане',
                'Орехите дават полезни мазнини',
              ],
              special_notes: 'Лека вечерна закуска за нощно възстановяване',
            }
          ),
        },
      ],
    },

    // Tuesday
    {
      day_of_week: 2,
      meals: [
        {
          meal_number: 1,
          time: '06:30',
          name: 'Протеинови палачинки с плодове',
          calories: 640,
          protein: 36,
          carbs: 82,
          fats: 20,
          ingredients: [
            { name: 'Овесени ядки', quantity: '80г', calories: 304 },
            { name: 'Яйца', quantity: '3 бр', calories: 234 },
            { name: 'Протеинов прах', quantity: '25г', calories: 100 },
            { name: 'Боровинки', quantity: '100г', calories: 57 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Смелете овесените ядки на брашно в блендер.',
              'Разбийте яйцата в купичка и прибавете овесеното брашно и протеина.',
              'Разбъркайте хубаво.',
              'Загрейте тиган с малко зехтин и изпечете палачинки от всяка страна по 2-3 минути.',
              'Поднесете с боровинките и меда.',
            ],
            8,
            12,
            'medium',
            {
              tips: ['Тестото трябва да е по-гъстичко от обикновените палачинки'],
              special_notes: 'Здравословна версия на класиката',
            }
          ),
        },
        {
          meal_number: 2,
          time: '09:30',
          name: 'Банан с бадемово масло и протеин',
          calories: 400,
          protein: 24,
          carbs: 46,
          fats: 16,
          ingredients: [
            { name: 'Банан', quantity: '1.5 бр', calories: 158 },
            { name: 'Бадемово масло', quantity: '2 с.л.', calories: 159 },
            { name: 'Протеинов прах', quantity: '15г', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Обелете банана и го нарежете на кръгчета.',
              'Намажете всяко парче с бадемово масло и поръсете с протеиновия прах отгоре.',
              'Готово за хапване!',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 3,
          time: '12:30',
          name: 'Пуешко с паста и зеленчуци',
          calories: 760,
          protein: 56,
          carbs: 92,
          fats: 22,
          ingredients: [
            { name: 'Пуешко месо', quantity: '200г', calories: 300 },
            { name: 'Пълнозърнести макарони', quantity: '110г сухи', calories: 385 },
            { name: 'Броколи', quantity: '150г', calories: 51 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 119 },
          ],
          recipe: createRecipe(
            [
              'Сварете макароните по инструкциите.',
              'Нарежете пуешкото на парчета и го запържете в зехтин за 7-8 минути.',
              'Почистете броколито и го сварете за 8 минути.',
              'Прецедете макароните и смесете всичко заедно.',
            ],
            8,
            20,
            'easy'
          ),
        },
        {
          meal_number: 4,
          time: '15:30',
          name: 'Кисело мляко с мюсли и протеин',
          calories: 460,
          protein: 32,
          carbs: 62,
          fats: 12,
          ingredients: [
            { name: 'Кисело мляко', quantity: '250г', calories: 150 },
            { name: 'Мюсли', quantity: '70г', calories: 257 },
            { name: 'Протеинов прах', quantity: '20г', calories: 80 },
          ],
          recipe: createRecipe(
            [
              'Сипете млякото в купичка, прибавете мюслито и протеиновия прах.',
              'Разбъркайте хубаво и оставете да набъбне за 5 минути.',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 5,
          time: '18:30',
          name: 'Говеждо с картофи и салата',
          calories: 720,
          protein: 54,
          carbs: 68,
          fats: 26,
          ingredients: [
            { name: 'Говеждо месо', quantity: '200г', calories: 440 },
            { name: 'Картофи печени', quantity: '250г', calories: 225 },
            { name: 'Зелена салата', quantity: '150г', calories: 23 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Загрейте фурната на 200°C.',
              'Нарежете картофите на едро, сложете ги в тава със зехтин и ги печете 35-40 минути.',
              'Запържете говеждото в тиган за 8-10 минути.',
              'Почистете и нарежете салатата.',
              'Сервирайте всичко заедно.',
            ],
            10,
            45,
            'easy'
          ),
        },
        {
          meal_number: 6,
          time: '21:00',
          name: 'Тост с авокадо и яйце',
          calories: 420,
          protein: 18,
          carbs: 44,
          fats: 22,
          ingredients: [
            { name: 'Пълнозърнест хляб', quantity: '2 филии', calories: 156 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 160 },
            { name: 'Яйце варено', quantity: '1 бр', calories: 78 },
          ],
          recipe: createRecipe(
            [
              'Препечете хляба.',
              'Сварете яйцето твърдо (10 мин).',
              'Размачкайте авокадото с вилица и намажете тостовете с него.',
              'Нарежете яйцето и го сложете отгоре.',
            ],
            5,
            10,
            'easy'
          ),
        },
      ],
    },

    // Wednesday
    {
      day_of_week: 3,
      meals: [
        {
          meal_number: 1,
          time: '06:30',
          name: 'Бъркани яйца с пълнозърнест хляб и авокадо',
          calories: 660,
          protein: 34,
          carbs: 58,
          fats: 34,
          ingredients: [
            { name: 'Яйца', quantity: '4 бр', calories: 312 },
            { name: 'Пълнозърнест хляб', quantity: '3 филии', calories: 234 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 160 },
            { name: 'Домати', quantity: '50г', calories: 9 },
          ],
          recipe: createRecipe(
            [
              'Разбийте яйцата в купичка.',
              'Нарежете доматите и ги запържете с яйцата за 3-4 минути.',
              'Препечете хляба, размачкайте авокадото и го намажете върху филийките.',
              'Сложете яйцата върху тостовете.',
            ],
            5,
            5,
            'easy'
          ),
        },
        {
          meal_number: 2,
          time: '09:30',
          name: 'Извара с боровинки и бадеми',
          calories: 420,
          protein: 28,
          carbs: 42,
          fats: 16,
          ingredients: [
            { name: 'Извара', quantity: '200г', calories: 260 },
            { name: 'Боровинки', quantity: '100г', calories: 57 },
            { name: 'Бадеми', quantity: '20г', calories: 116 },
            { name: 'Мед', quantity: '1 ч.л.', calories: 21 },
          ],
          recipe: createRecipe(
            [
              'Извадете изварата.',
              'Измийте боровинките и ги посипете отгоре.',
              'Добавете бадемите и меда.',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 3,
          time: '12:30',
          name: 'Пиле с булгур, зеленчуци и сладък картоф',
          calories: 740,
          protein: 58,
          carbs: 88,
          fats: 20,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '220г', calories: 363 },
            { name: 'Булгур', quantity: '150г сготвен', calories: 125 },
            { name: 'Сладък картоф', quantity: '150г', calories: 135 },
            { name: 'Спанак', quantity: '100г', calories: 23 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 119 },
          ],
          recipe: createRecipe(
            [
              'Сварете булгура за 10 минути.',
              'Обелете и сварете сладкия картоф за 15 минути.',
              'Запържете пилето със зехтин за 7 минути от всяка страна.',
              'Прибавете спанака за 2 минути.',
              'Сервирайте всичко заедно.',
            ],
            10,
            20,
            'easy'
          ),
        },
        {
          meal_number: 4,
          time: '15:30',
          name: 'Протеинов шейк с банан и овесени ядки',
          calories: 480,
          protein: 38,
          carbs: 64,
          fats: 10,
          ingredients: [
            { name: 'Протеинов прах', quantity: '40г', calories: 160 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Овесени ядки', quantity: '40г', calories: 152 },
            { name: 'Мляко', quantity: '250мл', calories: 125 },
          ],
          recipe: createRecipe(
            [
              'Сложете всичко в блендер и миксирайте за 40 секунди.',
              'Готово за пиене!',
            ],
            2,
            1,
            'easy'
          ),
        },
        {
          meal_number: 5,
          time: '18:30',
          name: 'Скумрия с кафяв ориз и печени зеленчуци',
          calories: 700,
          protein: 48,
          carbs: 68,
          fats: 30,
          ingredients: [
            { name: 'Скумрия', quantity: '200г', calories: 460 },
            { name: 'Кафяв ориз', quantity: '150г', calories: 188 },
            { name: 'Печени зеленчуци', quantity: '150г', calories: 90 },
          ],
          recipe: createRecipe(
            [
              'Сварете ориза по инструкциите.',
              'Запържете скумрията за 5-6 минути от всяка страна.',
              'Нарежете зеленчуците и ги печете за 20 минути на 200°C.',
              'Поднесете всичко заедно.',
            ],
            8,
            25,
            'easy'
          ),
        },
        {
          meal_number: 6,
          time: '21:00',
          name: 'Кисело мляко с орехи',
          calories: 320,
          protein: 16,
          carbs: 32,
          fats: 18,
          ingredients: [
            { name: 'Кисело мляко', quantity: '200г', calories: 120 },
            { name: 'Орехи', quantity: '30г', calories: 196 },
            { name: 'Мед', quantity: '1 ч.л.', calories: 21 },
          ],
          recipe: createRecipe(
            [
              'Извадете млякото.',
              'Натрошете орехите и ги посипете върху млякото.',
              'Полейте с меда.',
            ],
            2,
            0,
            'easy'
          ),
        },
      ],
    },

    // Thursday
    {
      day_of_week: 4,
      meals: [
        {
          meal_number: 1,
          time: '06:30',
          name: 'Мюсли с протеин, мляко и плодове',
          calories: 620,
          protein: 34,
          carbs: 86,
          fats: 18,
          ingredients: [
            { name: 'Мюсли', quantity: '90г', calories: 330 },
            { name: 'Протеинов прах', quantity: '25г', calories: 100 },
            { name: 'Мляко', quantity: '250мл', calories: 125 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
          ],
          recipe: createRecipe(
            [
              'Сипете мюслито в купичка и го залейте с млякото.',
              'Прибавете протеина и разбъркайте.',
              'Нарежете банана отгоре.',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 2,
          time: '09:30',
          name: 'Препечени филийки с фъстъчено масло',
          calories: 440,
          protein: 18,
          carbs: 56,
          fats: 18,
          ingredients: [
            { name: 'Пълнозърнест хляб', quantity: '3 филии', calories: 234 },
            { name: 'Фъстъчено масло', quantity: '3 с.л.', calories: 282 },
          ],
          recipe: createRecipe(
            ['Препечете филиите и намажете всяка с фъстъчено масло.', 'Готово!'],
            2,
            2,
            'easy'
          ),
        },
        {
          meal_number: 3,
          time: '12:30',
          name: 'Телешко с ориз и зеленчуци',
          calories: 760,
          protein: 56,
          carbs: 78,
          fats: 26,
          ingredients: [
            { name: 'Телешко месо', quantity: '200г', calories: 400 },
            { name: 'Бял ориз', quantity: '160г', calories: 208 },
            { name: 'Броколи', quantity: '150г', calories: 51 },
            { name: 'Моркови', quantity: '100г', calories: 41 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Сварете ориза.',
              'Сварете броколито и морковите за 10 минути.',
              'Запържете телешкото със зехтин за 8 минути.',
              'Сервирайте всичко заедно.',
            ],
            8,
            20,
            'easy'
          ),
        },
        {
          meal_number: 4,
          time: '15:30',
          name: 'Смути с протеин, банан и ябълка',
          calories: 420,
          protein: 32,
          carbs: 62,
          fats: 8,
          ingredients: [
            { name: 'Протеинов прах', quantity: '35г', calories: 140 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Ябълка', quantity: '1 бр', calories: 95 },
            { name: 'Овесено мляко', quantity: '250мл', calories: 113 },
          ],
          recipe: createRecipe(
            [
              'Нарежете плодовете, сложете всичко в блендер и миксирайте за 30 секунди.',
            ],
            3,
            1,
            'easy'
          ),
        },
        {
          meal_number: 5,
          time: '18:30',
          name: 'Сьомга със сладък картоф и аспержи',
          calories: 680,
          protein: 52,
          carbs: 62,
          fats: 28,
          ingredients: [
            { name: 'Сьомга', quantity: '200г', calories: 416 },
            { name: 'Сладък картоф', quantity: '200г', calories: 180 },
            { name: 'Аспержи', quantity: '150г', calories: 30 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Обелете и сварете сладкия картоф за 20 минути.',
              'Изпечете сьомгата за 15 минути на 180°C.',
              'Сварете аспержите за 6 минути.',
              'Поднесете всичко заедно.',
            ],
            8,
            25,
            'easy'
          ),
        },
        {
          meal_number: 6,
          time: '21:00',
          name: 'Яйца варени с авокадо',
          calories: 400,
          protein: 20,
          carbs: 14,
          fats: 30,
          ingredients: [
            { name: 'Яйца варени', quantity: '3 бр', calories: 234 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 160 },
          ],
          recipe: createRecipe(
            [
              'Сварете яйцата твърдо за 10 минути и ги обелете.',
              'Нарежете авокадото и сервирайте всичко заедно.',
            ],
            5,
            10,
            'easy'
          ),
        },
      ],
    },

    // Friday
    {
      day_of_week: 5,
      meals: [
        {
          meal_number: 1,
          time: '06:30',
          name: 'Овесена каша с протеин, ядки и плодове',
          calories: 680,
          protein: 32,
          carbs: 92,
          fats: 22,
          ingredients: [
            { name: 'Овесени ядки', quantity: '100г', calories: 380 },
            { name: 'Протеинов прах', quantity: '30г', calories: 120 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Бадеми', quantity: '20г', calories: 116 },
            { name: 'Мед', quantity: '1 ч.л.', calories: 21 },
          ],
          recipe: createRecipe(
            [
              'Сипете овесените ядки в купичка и ги залейте с 300мл гореща вода или мляко.',
              'Оставете за 3-4 минути да набъбнат.',
              'Прибавете протеина и разбъркайте.',
              'Нарежете банана, натрошете бадемите и ги поръсете върху кашата.',
              'Полейте с меда.',
            ],
            5,
            5,
            'easy'
          ),
        },
        {
          meal_number: 2,
          time: '09:30',
          name: 'Извара с орехи и мед',
          calories: 420,
          protein: 26,
          carbs: 36,
          fats: 20,
          ingredients: [
            { name: 'Извара', quantity: '200г', calories: 260 },
            { name: 'Орехи', quantity: '25г', calories: 164 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Сипете изварата в купичка.',
              'Натрошете орехите, поръсете ги върху изварата и полейте с меда отгоре.',
              'Готово за хапване!',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 3,
          time: '12:30',
          name: 'Пиле с киноа, зеленчуци и картофи',
          calories: 740,
          protein: 58,
          carbs: 82,
          fats: 20,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '220г', calories: 363 },
            { name: 'Киноа', quantity: '140г', calories: 168 },
            { name: 'Картофи', quantity: '120г', calories: 92 },
            { name: 'Тиквички', quantity: '150г', calories: 25 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 119 },
          ],
          recipe: createRecipe(
            [
              'Сварете киноата по инструкциите на опаковката.',
              'Обелете и нарежете картофите на кубчета и ги изпържете до златисто.',
              'Нарежете пилето на парченца и го запържете със зехтин за 8-10 минути.',
              'Нарежете тиквичките на кръгчета и ги прибавете при пилето за 5 минути.',
              'Поднесете всичко заедно.',
            ],
            10,
            25,
            'easy'
          ),
        },
        {
          meal_number: 4,
          time: '15:30',
          name: 'Протеинов шейк с овесени ядки',
          calories: 460,
          protein: 36,
          carbs: 58,
          fats: 10,
          ingredients: [
            { name: 'Протеинов прах', quantity: '40г', calories: 160 },
            { name: 'Овесени ядки', quantity: '40г', calories: 152 },
            { name: 'Банан', quantity: '1/2 бр', calories: 53 },
            { name: 'Мляко', quantity: '250мл', calories: 125 },
          ],
          recipe: createRecipe(
            [
              'Сложете всички съставки в шейкър или блендер и миксирайте за 30 секунди, докато стане гладко.',
              'Сипете в чаша.',
              'Готово за пиене!',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 5,
          time: '18:30',
          name: 'Говеждо с кафяв ориз и броколи',
          calories: 720,
          protein: 56,
          carbs: 72,
          fats: 26,
          ingredients: [
            { name: 'Говеждо месо', quantity: '200г', calories: 440 },
            { name: 'Кафяв ориз', quantity: '160г', calories: 200 },
            { name: 'Броколи', quantity: '150г', calories: 51 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Сварете кафявия ориз по инструкциите.',
              'Нарежете говеждото на парченца.',
              'Загрейте тиган със зехтин и запържете месото за 6-8 минути от всяка страна.',
              'Накълцайте броколито на розички и го сварете за 4-5 минути.',
              'Поднесете всичко заедно.',
            ],
            8,
            25,
            'easy'
          ),
        },
        {
          meal_number: 6,
          time: '21:00',
          name: 'Кисело мляко с боровинки',
          calories: 260,
          protein: 14,
          carbs: 38,
          fats: 6,
          ingredients: [
            { name: 'Кисело мляко', quantity: '200г', calories: 120 },
            { name: 'Боровинки', quantity: '100г', calories: 57 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Сипете киселото мляко в купичка, поръсете с боровинките и полейте с меда.',
              'Готово!',
            ],
            2,
            0,
            'easy'
          ),
        },
      ],
    },

    // Saturday
    {
      day_of_week: 6,
      meals: [
        {
          meal_number: 1,
          time: '07:00',
          name: 'Протеинови палачинки с плодове и мед',
          calories: 680,
          protein: 38,
          carbs: 88,
          fats: 22,
          ingredients: [
            { name: 'Овесени ядки', quantity: '90г', calories: 342 },
            { name: 'Яйца', quantity: '3 бр', calories: 234 },
            { name: 'Протеинов прах', quantity: '25г', calories: 100 },
            { name: 'Ягоди', quantity: '100г', calories: 32 },
            { name: 'Банан', quantity: '1/2 бр', calories: 53 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Смелете овесените ядки на брашно.',
              'Разбийте яйцата, прибавете протеина и разбъркайте хубаво.',
              'Загрейте незалепваща тава и изпечете 3-4 палачинки.',
              'Нарежете плодовете и ги поднесете с палачинките и меда отгоре.',
            ],
            8,
            12,
            'easy'
          ),
        },
        {
          meal_number: 2,
          time: '10:00',
          name: 'Смесени ядки и финики',
          calories: 400,
          protein: 12,
          carbs: 48,
          fats: 20,
          ingredients: [
            { name: 'Микс ядки', quantity: '40г', calories: 240 },
            { name: 'Финики', quantity: '50г', calories: 139 },
          ],
          recipe: createRecipe(
            ['Сипете ядките в купичка и прибавете фурмите.', 'Готово за хапване!'],
            1,
            0,
            'easy'
          ),
        },
        {
          meal_number: 3,
          time: '13:00',
          name: 'Пуешко с паста и зеленчуци',
          calories: 760,
          protein: 56,
          carbs: 92,
          fats: 22,
          ingredients: [
            { name: 'Пуешко месо', quantity: '200г', calories: 300 },
            { name: 'Пълнозърнести макарони', quantity: '110г', calories: 385 },
            { name: 'Броколи', quantity: '150г', calories: 51 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 119 },
          ],
          recipe: createRecipe(
            [
              'Сварете пастата по инструкциите.',
              'Нарежете пуешкото на филийки и го запържете в тиган със зехтин за 7-9 минути.',
              'Сварете броколито за 5 минути.',
              'Прецедете пастата и смесете всичко заедно.',
            ],
            8,
            20,
            'easy'
          ),
        },
        {
          meal_number: 4,
          time: '16:00',
          name: 'Домашен протеинов бар',
          calories: 440,
          protein: 24,
          carbs: 52,
          fats: 18,
          ingredients: [
            { name: 'Овесени ядки', quantity: '50г', calories: 190 },
            { name: 'Протеинов прах', quantity: '25г', calories: 100 },
            { name: 'Финики', quantity: '40г', calories: 111 },
            { name: 'Бадемово масло', quantity: '15г', calories: 93 },
          ],
          recipe: createRecipe(
            [
              'Смелете фурмите в блендер.',
              'Прибавете овесените ядки, протеина и бадемовото масло.',
              'Миксирайте, докато стане тесто, и го оформете в правоъгълници.',
              'Готово!',
            ],
            8,
            0,
            'easy'
          ),
        },
        {
          meal_number: 5,
          time: '19:00',
          name: 'Сафрид с картофи и салата',
          calories: 680,
          protein: 52,
          carbs: 62,
          fats: 26,
          ingredients: [
            { name: 'Сафрид', quantity: '220г', calories: 380 },
            { name: 'Картофи печени', quantity: '220г', calories: 198 },
            { name: 'Зелена салата', quantity: '150г', calories: 23 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Обелете и нарежете картофите.',
              'Изпечете ги за 30 минути на 200°C.',
              'Запържете сафрида за 6-7 минути от всяка страна.',
              'Накълцайте салатата и я полейте със зехтин.',
              'Поднесете всичко заедно.',
            ],
            8,
            35,
            'easy'
          ),
        },
        {
          meal_number: 6,
          time: '21:30',
          name: 'Извара с бадеми',
          calories: 360,
          protein: 24,
          carbs: 28,
          fats: 18,
          ingredients: [
            { name: 'Извара', quantity: '180г', calories: 234 },
            { name: 'Бадеми', quantity: '25г', calories: 145 },
          ],
          recipe: createRecipe(
            [
              'Сипете изварата в купичка, натрошете бадемите и ги поръсете върху нея.',
              'Готово!',
            ],
            2,
            0,
            'easy'
          ),
        },
      ],
    },

    // Sunday
    {
      day_of_week: 7,
      meals: [
        {
          meal_number: 1,
          time: '07:30',
          name: 'Френски тост с ягоди и протеин',
          calories: 660,
          protein: 34,
          carbs: 82,
          fats: 24,
          ingredients: [
            { name: 'Пълнозърнест хляб', quantity: '4 филии', calories: 312 },
            { name: 'Яйца', quantity: '3 бр', calories: 234 },
            { name: 'Протеинов прах', quantity: '20г', calories: 80 },
            { name: 'Ягоди', quantity: '100г', calories: 32 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Разбийте яйцата с протеина.',
              'Потопете хляба в сместа.',
              'Загрейте незалепваща тава и изпечете всяка филия по 3 минути от всяка страна.',
              'Поръсете с ягодите и полейте с меда.',
            ],
            5,
            12,
            'easy'
          ),
        },
        {
          meal_number: 2,
          time: '10:30',
          name: 'Смути боул с мюсли и плодове',
          calories: 480,
          protein: 22,
          carbs: 74,
          fats: 14,
          ingredients: [
            { name: 'Замразени боровинки', quantity: '150г', calories: 85 },
            { name: 'Банан', quantity: '1 бр', calories: 105 },
            { name: 'Протеинов прах', quantity: '20г', calories: 80 },
            { name: 'Мюсли', quantity: '50г', calories: 183 },
            { name: 'Бадеми', quantity: '10г', calories: 58 },
          ],
          recipe: createRecipe(
            [
              'Сложете боровинките, банана и протеина в блендер и миксирайте до гладкост.',
              'Сипете в купичка, поръсете с мюслито и добавете бадемите отгоре.',
              'Готово!',
            ],
            5,
            0,
            'easy'
          ),
        },
        {
          meal_number: 3,
          time: '13:30',
          name: 'Пълнени чушки с месо и ориз',
          calories: 720,
          protein: 52,
          carbs: 78,
          fats: 24,
          ingredients: [
            { name: 'Пуешко кайма', quantity: '200г', calories: 300 },
            { name: 'Ориз', quantity: '120г сготвен', calories: 156 },
            { name: 'Чушки', quantity: '200г', calories: 62 },
            { name: 'Доматен сос', quantity: '100г', calories: 45 },
            { name: 'Зехтин', quantity: '1 с.л.', calories: 119 },
          ],
          recipe: createRecipe(
            [
              'Сварете ориза.',
              'Запържете каймата със зехтин и я смесете с ориза.',
              'Изрежете горната част на чушките и ги напълнете с плънката.',
              'Залейте с доматен сос и печете 40 минути на 180°C.',
            ],
            10,
            50,
            'medium'
          ),
        },
        {
          meal_number: 4,
          time: '16:30',
          name: 'Кисело мляко с орехи и мед',
          calories: 380,
          protein: 18,
          carbs: 38,
          fats: 20,
          ingredients: [
            { name: 'Кисело мляко', quantity: '200г', calories: 120 },
            { name: 'Орехи', quantity: '30г', calories: 196 },
            { name: 'Мед', quantity: '2 ч.л.', calories: 42 },
          ],
          recipe: createRecipe(
            [
              'Сипете киселото мляко в купичка.',
              'Натрошете орехите, поръсете ги върху млякото и полейте с меда.',
              'Готово!',
            ],
            3,
            0,
            'easy'
          ),
        },
        {
          meal_number: 5,
          time: '19:30',
          name: 'Пиле с киноа и печени зеленчуци',
          calories: 700,
          protein: 56,
          carbs: 72,
          fats: 20,
          ingredients: [
            { name: 'Пилешки гърди', quantity: '220г', calories: 363 },
            { name: 'Киноа', quantity: '150г', calories: 180 },
            { name: 'Печени зеленчуци', quantity: '200г', calories: 120 },
            { name: 'Зехтин', quantity: '1/2 с.л.', calories: 60 },
          ],
          recipe: createRecipe(
            [
              'Сварете киноата по инструкциите.',
              'Нарежете зеленчуците и ги изпечете за 25 минути на 200°C със зехтин.',
              'Запържете пилето за 8-10 минути от всяка страна.',
              'Поднесете всичко заедно.',
            ],
            8,
            30,
            'easy'
          ),
        },
        {
          meal_number: 6,
          time: '22:00',
          name: 'Тост с авокадо',
          calories: 320,
          protein: 10,
          carbs: 38,
          fats: 16,
          ingredients: [
            { name: 'Пълнозърнест хляб', quantity: '2 филии', calories: 156 },
            { name: 'Авокадо', quantity: '1/2 бр', calories: 160 },
          ],
          recipe: createRecipe(
            [
              'Препечете хляба в тостер.',
              'Нарежете авокадото и го сложете върху тоста.',
              'Готово!',
            ],
            3,
            2,
            'easy'
          ),
        },
      ],
    },
  ],
}
