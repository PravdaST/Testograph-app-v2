/**
 * LIBIDO Program Workouts - LOW Level - GYM VERSION
 * For users with LOW libido score (0-40 points)
 * Focus: Foundation strength, testosterone-boosting compounds, adequate recovery
 * Frequency: 2-3 days/week
 * Duration: 40-45 minutes
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

export const LIBIDO_LOW_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Lower Body Compounds
  {
    day_of_week: 1,
    name: 'Долна част - Съставни',
    duration: 40,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове с щанга (леко)',
        name_en: 'barbell squat',
        sets: 3,
        reps: '8-10',
        rest_seconds: 120,
        notes: 'Фокус върху форма, не товар. Стимулира тестостерон.',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег преса',
        name_en: 'leg press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Умерен товар, пълна амплитуда',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Бедрено сгъване от лег',
        name_en: 'leg curl',
        sets: 2,
        reps: '12',
        rest_seconds: 60,
        notes: 'Задна част на бедрата',
      },
      {
        exercisedb_id: 'IeDEXTe',
        name_bg: 'Повдигане за прасци на машина',
        name_en: 'calf raise machine',
        sets: 2,
        reps: '15',
        rest_seconds: 45,
        notes: 'Финишер за крака',
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
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Вдигане от лег с щанга (умерено)',
        name_en: 'bench press',
        sets: 3,
        reps: '8-10',
        rest_seconds: 120,
        notes: 'Контролирано надолу, експлозивно нагоре',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Вертикален скрипец',
        name_en: 'lat pulldown',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Широк гръб',
      },
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменни преси с дъмбели',
        name_en: 'dumbbell shoulder press',
        sets: 2,
        reps: '10',
        rest_seconds: 90,
        notes: 'Умерен товар',
      },
      {
        exercisedb_id: 'PQStVXH',
        name_bg: 'Гребане на долен скрипец',
        name_en: 'cable row',
        sets: 2,
        reps: '12',
        rest_seconds: 60,
        notes: 'Средна част на гръб',
      },
    ],
  },

  // Friday - Full Body Light (Week 3-4)
  {
    day_of_week: 5,
    name: 'Цяло тяло - Леко',
    duration: 45,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове с щанга',
        name_en: 'barbell squat',
        sets: 3,
        reps: '10',
        rest_seconds: 90,
        notes: 'По-лек товар от понеделник',
      },
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Вдигане от лег с щанга',
        name_en: 'bench press',
        sets: 3,
        reps: '10',
        rest_seconds: 90,
        notes: 'Умерен товар',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Вертикален скрипец',
        name_en: 'lat pulldown',
        sets: 2,
        reps: '12',
        rest_seconds: 60,
        notes: 'Поддържащ обем',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 2,
        reps: '40-50s',
        rest_seconds: 45,
        notes: 'Коремна стабилизация',
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
