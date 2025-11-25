/**
 * LIBIDO Program Workouts - LOW Level - HOME VERSION
 * For users with LOW libido score (0-40 points)
 * Focus: Gentle strength building, testosterone support, no overtraining
 * Frequency: 2-3 days/week
 * Duration: 30-40 minutes
 * Intensity: 65-75% of max effort
 */

export interface Exercise {
  exercisedb_id: string
  name_bg: string
  name_en: string
  sets: number
  reps: number | string
  rest_seconds: number
  notes?: string
}

export interface WorkoutProgram {
  day_of_week: number
  name: string
  duration: number
  exercises: Exercise[]
}

export const LIBIDO_LOW_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Lower Body Focus
  {
    day_of_week: 1,
    name: 'Долна част - Основи',
    duration: 35,
    exercises: [
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 3,
        reps: '12-15',
        rest_seconds: 90,
        notes: 'Бавно надолу (3 сек), стимулира тестостерон',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Седалищен мост',
        name_en: 'glute bridge',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Задържане 2s горе, силно свиване на седалището',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Напади (статични)',
        name_en: 'lunge',
        sets: 2,
        reps: '10/крак',
        rest_seconds: 60,
        notes: 'Фокус върху баланс и контрол',
      },
      {
        exercisedb_id: '2ORFMoR',
        name_bg: 'Повдигане на прасци',
        name_en: 'calf raise',
        sets: 2,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Пълна амплитуда',
      },
    ],
  },

  // Tuesday - Rest
  {
    day_of_week: 2,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Wednesday - Rest
  {
    day_of_week: 3,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Thursday - Upper Body Strength
  {
    day_of_week: 4,
    name: 'Горна част - Сила',
    duration: 35,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Темпо 2-0-1, контролирано',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Обратно гребане (с маса или лост)',
        name_en: 'inverted row',
        sets: 3,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Гръб и бицепс',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Кофички на стол',
        name_en: 'chair dips',
        sets: 2,
        reps: '8-10',
        rest_seconds: 60,
        notes: 'Трицепс работа',
      },
      {
        exercisedb_id: 'KhHJ338',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 2,
        reps: '30-40s',
        rest_seconds: 45,
        notes: 'Коремна стабилизация',
      },
    ],
  },

  // Friday - Full Body Circuit (Week 3-4)
  {
    day_of_week: 5,
    name: 'Цяло тяло - Кръг',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Клекове',
        name_en: 'squat',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Умерено темпо',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Пълна амплитуда',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Седалищен мост на един крак',
        name_en: 'single leg glute bridge',
        sets: 2,
        reps: '10/крак',
        rest_seconds: 60,
        notes: 'Напреднала вариация',
      },
      {
        exercisedb_id: 'KhHJ338',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '35-45s',
        rest_seconds: 45,
        notes: 'Постепенно увеличаване',
      },
    ],
  },

  // Saturday - Rest
  {
    day_of_week: 6,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Sunday - Rest
  {
    day_of_week: 7,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },
]
