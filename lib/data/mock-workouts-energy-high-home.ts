/**
 * ENERGY Program Workouts - HIGH Level - HOME VERSION
 * For users with HIGH energy score (71-100 points)
 * Focus: Advanced HIIT, explosive movements, maximum performance
 * Frequency: 5-6 days/week
 * Duration: 55-65 minutes
 * Intensity: 85-95% of max effort
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

export const ENERGY_HIGH_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - HIIT Circuit Explosive
  {
    day_of_week: 1,
    name: 'HIIT кръг - Експлозивен',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 4,
        reps: '15',
        rest_seconds: 45,
        notes: 'Максимална скорост, пълна амплитуда',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове',
        name_en: 'jump squat',
        sets: 4,
        reps: '20',
        rest_seconds: 30,
        notes: 'Експлозивен скок нагоре',
      },
      {
        exercisedb_id: 'Fey3oVx',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '30',
        rest_seconds: 30,
        notes: 'Максимално темпо',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Взривни опори',
        name_en: 'explosive push-up',
        sets: 4,
        reps: '12-15',
        rest_seconds: 45,
        notes: 'Ръцете напускат земята',
      },
      {
        exercisedb_id: 'eL6Lz0v',
        name_bg: 'Високи колене',
        name_en: 'high knees',
        sets: 4,
        reps: '45s',
        rest_seconds: 30,
        notes: 'Максимална скорост и височина',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк с докосване до рамо',
        name_en: 'plank shoulder tap',
        sets: 3,
        reps: '20',
        rest_seconds: 30,
        notes: 'Алтернирайте рамене',
      },
    ],
  },

  // Tuesday - Cardio Endurance + Core
  {
    day_of_week: 2,
    name: 'Кардио издръжливост + Корем',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'eL6Lz0v',
        name_bg: 'Спринт на място',
        name_en: 'sprint in place',
        sets: 6,
        reps: '30s',
        rest_seconds: 30,
        notes: 'Максимален интензитет',
      },
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 5,
        reps: '12',
        rest_seconds: 30,
        notes: 'Непрекъснато темпо',
      },
      {
        exercisedb_id: 'tZkGYZ9',
        name_bg: 'Колело коремни',
        name_en: 'bicycle crunch',
        sets: 4,
        reps: '30',
        rest_seconds: 20,
        notes: 'Бързо темпо',
      },
      {
        exercisedb_id: 'PM1PZjg',
        name_bg: 'Скокови напади',
        name_en: 'jumping lunge',
        sets: 4,
        reps: '20 (10/крак)',
        rest_seconds: 30,
        notes: 'Експлозивна смяна',
      },
      {
        exercisedb_id: 'UVo2Qs2',
        name_bg: 'Флътър кикс',
        name_en: 'flutter kick',
        sets: 4,
        reps: '45s',
        rest_seconds: 20,
        notes: 'Стабилна долна част на гръб',
      },
    ],
  },

  // Wednesday - Full Body Power
  {
    day_of_week: 3,
    name: 'Цяло тяло - Сила',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове с темп',
        name_en: 'tempo squat',
        sets: 5,
        reps: '20',
        rest_seconds: 45,
        notes: 'Експлозивно нагоре, контролирано надолу',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори (вариации)',
        name_en: 'push-up variations',
        sets: 5,
        reps: '15-20',
        rest_seconds: 30,
        notes: 'Широк/тесен/диамантен хват',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Австралийски лост',
        name_en: 'inverted row',
        sets: 4,
        reps: '15',
        rest_seconds: 45,
        notes: 'Максимално свиване на гръб',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове (дълбоки)',
        name_en: 'deep jump squat',
        sets: 4,
        reps: '15',
        rest_seconds: 30,
        notes: 'Максимална амплитуда',
      },
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Пайк опори',
        name_en: 'pike push-up',
        sets: 4,
        reps: '12-15',
        rest_seconds: 40,
        notes: 'Рамене под натоварване',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (дълъг)',
        name_en: 'extended plank hold',
        sets: 3,
        reps: '90s',
        rest_seconds: 45,
        notes: 'Максимално напрежение',
      },
    ],
  },

  // Thursday - HIIT Tabata Style
  {
    day_of_week: 4,
    name: 'HIIT - Табата',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита (табата)',
        name_en: 'burpee tabata',
        sets: 8,
        reps: '20s работа / 10s почивка',
        rest_seconds: 10,
        notes: '4 минути - максимален интензитет',
      },
      {
        exercisedb_id: 'Fey3oVx',
        name_bg: 'Планински катерач (табата)',
        name_en: 'mountain climber tabata',
        sets: 8,
        reps: '20s работа / 10s почивка',
        rest_seconds: 10,
        notes: '4 минути - високо темпо',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове (табата)',
        name_en: 'jump squat tabata',
        sets: 8,
        reps: '20s работа / 10s почивка',
        rest_seconds: 10,
        notes: '4 минути - експлозивност',
      },
      {
        exercisedb_id: 'eL6Lz0v',
        name_bg: 'Високи колене (табата)',
        name_en: 'high knees tabata',
        sets: 8,
        reps: '20s работа / 10s почивка',
        rest_seconds: 10,
        notes: '4 минути - максимална скорост',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк джакс',
        name_en: 'plank jacks',
        sets: 4,
        reps: '20',
        rest_seconds: 20,
        notes: 'Корем стабилизация под темпо',
      },
    ],
  },

  // Friday - Lower Body Explosive
  {
    day_of_week: 5,
    name: 'Крака - Експлозивен',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове',
        name_en: 'jump squat',
        sets: 5,
        reps: '20',
        rest_seconds: 45,
        notes: 'Максимална височина',
      },
      {
        exercisedb_id: 'PM1PZjg',
        name_bg: 'Скокови напади',
        name_en: 'jumping lunge',
        sets: 5,
        reps: '24 (12/крак)',
        rest_seconds: 45,
        notes: 'Експлозивна смяна в скок',
      },
      {
        exercisedb_id: 'aWedzZX',
        name_bg: 'Мост на един крак',
        name_en: 'single leg glute bridge',
        sets: 4,
        reps: '15/крак',
        rest_seconds: 30,
        notes: 'Задържане 2s горе',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Пистол клекове (асистирани)',
        name_en: 'pistol squat assisted',
        sets: 4,
        reps: '8/крак',
        rest_seconds: 60,
        notes: 'С опора ако е нужно',
      },
      {
        exercisedb_id: '2ORFMoR',
        name_bg: 'Скокове на прасци',
        name_en: 'calf jump',
        sets: 4,
        reps: '25',
        rest_seconds: 30,
        notes: 'Бързи повторения',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк с повдигане на крак',
        name_en: 'plank leg lift',
        sets: 3,
        reps: '20 (10/крак)',
        rest_seconds: 30,
        notes: 'Алтернирайте',
      },
    ],
  },

  // Saturday - Active Recovery Circuit
  {
    day_of_week: 6,
    name: 'Активно възстановяване',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Динамично ходене',
        name_en: 'dynamic walking',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Умерено до високо темпо',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Леки клекове',
        name_en: 'light squat',
        sets: 3,
        reps: '15',
        rest_seconds: 45,
        notes: 'Мобилност и кръвоток',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Леки опори',
        name_en: 'light push-up',
        sets: 3,
        reps: '12',
        rest_seconds: 45,
        notes: 'Контролирано темпо',
      },
      {
        exercisedb_id: 'bWlZvXh',
        name_bg: 'Йога флоу',
        name_en: 'yoga flow',
        sets: 1,
        reps: '15 мин',
        rest_seconds: 0,
        notes: 'Стречинг и мобилност',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (леко задържане)',
        name_en: 'light plank hold',
        sets: 2,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Поддържащо натоварване',
      },
    ],
  },

  // Sunday - Rest
  {
    day_of_week: 7,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },
]
