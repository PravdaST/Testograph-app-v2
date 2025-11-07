/**
 * ENERGY Program Workouts
 * Focus: Cardio, HIIT, explosive movements, endurance
 * 4-5 days/week with more active recovery
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

export const ENERGY_NORMAL_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - HIIT + Full Body
  {
    day_of_week: 1,
    name: 'HIIT + Цяло тяло',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 4,
        reps: '12-15',
        rest_seconds: 45,
        notes: 'Експлозивно движение. Ускорява метаболизма и повишава енергията.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '30-40',
        rest_seconds: 40,
        notes: 'Бързо темпо. Отличен за кардио и корем.',
      },
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Джъмпинг Джакс',
        name_en: 'air bike',
        sets: 4,
        reps: '45-60s',
        rest_seconds: 30,
        notes: 'Класическо кардио. Повишава сърдечната честота.',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Скок клекове',
        name_en: 'jump squat',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Плиометрично упражнение за експлозивна сила.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '45-60s',
        rest_seconds: 45,
        notes: 'Задържане на стабилност. Укрепва корема.',
      },
    ],
  },

  // Tuesday - Active Recovery / Light Cardio
  {
    day_of_week: 2,
    name: 'Активна почивка',
    duration: 30,
    exercises: [
      {
        exercisedb_id: 'walking',
        name_bg: 'Бърза разходка',
        name_en: 'brisk walking',
        sets: 1,
        reps: '30мин',
        rest_seconds: 0,
        notes: 'Лека кардио активност. Поддържа енергийните нива.',
      },
      {
        exercisedb_id: '1jXLYEw',
        name_bg: 'Разтягане',
        name_en: 'stretching',
        sets: 1,
        reps: '10мин',
        rest_seconds: 0,
        notes: 'Динамично разтягане за възстановяване.',
      },
    ],
  },

  // Wednesday - Cardio Intervals
  {
    day_of_week: 3,
    name: 'Кардио интервали',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'eL6Lz0v',
        name_bg: 'Високи колене',
        name_en: 'high knees',
        sets: 5,
        reps: '45s',
        rest_seconds: 30,
        notes: 'Интензивно кардио. Повишава издръжливостта.',
      },
      {
        exercisedb_id: 'eL6Lz0v',
        name_bg: 'Ритане назад',
        name_en: 'butt kicks',
        sets: 5,
        reps: '45s',
        rest_seconds: 30,
        notes: 'Активира задната верига. Подобрява координацията.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '40-50',
        rest_seconds: 40,
        notes: 'Комбинация кардио + корем.',
      },
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Финализира тренировката с експлозивност.',
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

  // Friday - Circuit Training
  {
    day_of_week: 5,
    name: 'Кръгова тренировка',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 4,
        reps: '15-20',
        rest_seconds: 30,
        notes: 'Бързо темпо между упражненията.',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 4,
        reps: '20-25',
        rest_seconds: 30,
        notes: 'Високи повторения за издръжливост.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '30-40',
        rest_seconds: 30,
        notes: 'Кардио в средата на кръга.',
      },
      {
        exercisedb_id: 'RRWFUcw',
        name_bg: 'Напади',
        name_en: 'dumbbell lunge',
        sets: 4,
        reps: '12-15',
        rest_seconds: 30,
        notes: 'Редувай краката без почивка.',
      },
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Джъмпинг Джакс',
        name_en: 'air bike',
        sets: 4,
        reps: '60s',
        rest_seconds: 90,
        notes: 'Финал на кръга. 90s почивка между кръговете.',
      },
    ],
  },

  // Saturday - Active Recovery
  {
    day_of_week: 6,
    name: 'Активна почивка',
    duration: 20,
    exercises: [
      {
        exercisedb_id: 'bWlZvXh',
        name_bg: 'Йога / Разтягане',
        name_en: 'yoga flow',
        sets: 1,
        reps: '20мин',
        rest_seconds: 0,
        notes: 'Фокус върху дишане и гъвкавост.',
      },
    ],
  },

  // Sunday - Почивка
  {
    day_of_week: 7,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },
]
