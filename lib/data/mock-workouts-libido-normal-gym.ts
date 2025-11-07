/**
 * LIBIDO Program Workouts
 * Focus: Heavy compounds (squats, deadlifts, bench), testosterone boost
 * 3-4 days/week with more rest for hormone optimization
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

export const LIBIDO_NORMAL_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Heavy Lower Body
  {
    day_of_week: 1,
    name: 'Долна част - Тежки тегла',
    duration: 50,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове с щанга',
        name_en: 'barbell squat',
        sets: 5,
        reps: '5-8',
        rest_seconds: 120,
        notes: 'Основно упражнение за тестостерон. Тежки тегла, малко повторения.',
      },
      {
        exercisedb_id: 'wQ2c4XD',
        name_bg: 'Румънска мъртва тяга',
        name_en: 'romanian deadlift',
        sets: 4,
        reps: '6-8',
        rest_seconds: 90,
        notes: 'Фокус върху задна част на бедрата и седалище.',
      },
      {
        exercisedb_id: 'RRWFUcw',
        name_bg: 'Напади с дъмбели',
        name_en: 'dumbbell lunge',
        sets: 3,
        reps: '8-10',
        rest_seconds: 60,
        notes: 'Допълнително натоварване за крака.',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Преса за крака',
        name_en: 'leg press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Завършваща серия за пълно изчерпване.',
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

  // Wednesday - Heavy Upper Body
  {
    day_of_week: 3,
    name: 'Горна част - Тежки тегла',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Лежанка със щанга',
        name_en: 'barbell bench press',
        sets: 5,
        reps: '5-8',
        rest_seconds: 120,
        notes: 'Основно упражнение за гръден кош. Тежки тегла.',
      },
      {
        exercisedb_id: 'BJ0Hz5L',
        name_bg: 'Гребане с дъмбели',
        name_en: 'dumbbell bent over row',
        sets: 4,
        reps: '6-8',
        rest_seconds: 90,
        notes: 'Изгражда гръб и осанка.',
      },
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменни преси с дъмбели',
        name_en: 'dumbbell shoulder press',
        sets: 4,
        reps: '8-10',
        rest_seconds: 75,
        notes: 'Развива рамене и горна част.',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Завършваща серия до отказ.',
      },
    ],
  },

  // Thursday - Rest
  {
    day_of_week: 4,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Friday - Full Body Power
  {
    day_of_week: 5,
    name: 'Пълно тяло - Сила',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'ila4NZS',
        name_bg: 'Мъртва тяга',
        name_en: 'barbell deadlift',
        sets: 5,
        reps: '5-6',
        rest_seconds: 150,
        notes: 'КРАЛ на упражненията! Най-висок тестостеронов отговор.',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Фронтални клекове',
        name_en: 'front squat',
        sets: 4,
        reps: '6-8',
        rest_seconds: 120,
        notes: 'Вариация на клеков за квадрицепс.',
      },
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Лежанка със щанга',
        name_en: 'barbell bench press',
        sets: 3,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Умерено натоварване след мъртва тяга.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '45-60s',
        rest_seconds: 60,
        notes: 'Стабилизация на корема.',
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

