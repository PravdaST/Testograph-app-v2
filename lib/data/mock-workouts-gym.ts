/**
 * Mock Workout Data
 * Exercise programs with ExerciseDB integration
 */

export interface Exercise {
  exercisedb_id: string // ExerciseDB API ID
  name_bg: string // Bulgarian name
  name_en: string // English name for API
  sets: number
  reps: number | string // Can be "10-12" or just "12"
  rest_seconds: number
  notes?: string
}

export interface WorkoutProgram {
  day_of_week: number
  name: string
  duration: number
  exercises: Exercise[]
}

// Libido-Low Program Workouts
export const MOCK_WORKOUTS: WorkoutProgram[] = [
  // Monday - Кардио + Долна част
  {
    day_of_week: 1,
    name: 'Кардио + Долна част',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Дръжте гърба изправен, а коленете да не излизат пред пръстите на краката.',
      },
      {
        exercisedb_id: 'RRWFUcw',
        name_bg: 'Напади',
        name_en: 'dumbbell lunge',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Редувайте краката.',
      },
      {
        exercisedb_id: 'wQ2c4XD',
        name_bg: 'Румънска мъртва тяга',
        name_en: 'barbell romanian deadlift',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Фокусирайте се върху натоварването в задната част на бедрата и седалищните мускули.',
      },
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Джъмпинг Джакс',
        name_en: 'air bike',
        sets: 3,
        reps: '30-45s',
        rest_seconds: 45,
        notes: 'Кардио за финал на тренировката.',
      },
    ],
  },

  // Tuesday - Почивка
  {
    day_of_week: 2,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Wednesday - Горна част на тялото
  {
    day_of_week: 3,
    name: 'Горна част на тялото',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 3,
        reps: '10-15',
        rest_seconds: 60,
        notes: 'Поддържайте тялото в права линия.',
      },
      {
        exercisedb_id: 'BJ0Hz5L',
        name_bg: 'Гребане с дъмбели',
        name_en: 'dumbbell bent over row',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Дръжте гърба успореден на пода.',
      },
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменни преси с дъмбели',
        name_en: 'dumbbell seated shoulder press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Стегнете коремните мускули за стабилност.',
      },
      {
        exercisedb_id: 'NbVPDMW',
        name_bg: 'Бицепсово сгъване с дъмбели',
        name_en: 'dumbbell biceps curl',
        sets: 3,
        reps: '12-15',
        rest_seconds: 45,
        notes: 'Изпълнявайте движението контролирано.',
      },
      {
        exercisedb_id: 'mpKZGWz',
        name_bg: 'Трицепсово разгъване с дъмбели',
        name_en: 'dumbbell lying triceps extension',
        sets: 3,
        reps: '12-15',
        rest_seconds: 45,
        notes: 'Дръжте лактите фиксирани.',
      },
    ],
  },

  // Thursday - Почивка
  {
    day_of_week: 4,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Friday - Пълно тяло
  {
    day_of_week: 5,
    name: 'Пълно тяло',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 3,
        reps: '8-12',
        rest_seconds: 60,
        notes: 'Изпълнявайте движението експлозивно.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '30-60s',
        rest_seconds: 45,
        notes: 'Поддържайте тялото в права линия.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 3,
        reps: '20-30',
        rest_seconds: 45,
        notes: 'Поддържайте бързо темпо.',
      },
      {
        exercisedb_id: 'ila4NZS',
        name_bg: 'Мъртва тяга',
        name_en: 'barbell deadlift',
        sets: 3,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Основно, многоставно движение.',
      },
    ],
  },

  // Saturday - Почивка
  {
    day_of_week: 6,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Sunday - Почивка
  {
    day_of_week: 7,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },
]
