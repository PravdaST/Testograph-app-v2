/**
 * MUSCLE Program Workouts - LOW Level - HOME VERSION
 * For users with LOW muscle score (0-40 points)
 * Focus: Building foundation, progressive bodyweight training
 * Frequency: 3 days/week
 * Duration: 35-45 minutes
 * Intensity: 60-70% of max effort
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

export const MUSCLE_LOW_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Push (Chest + Shoulders + Triceps)
  {
    day_of_week: 1,
    name: 'Push - Гърди, Рамене, Трицепс',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Темпо 2-0-1, може на колене ако е нужно',
      },
      {
        exercisedb_id: 'F7vjXqT',
        name_bg: 'Лицеви опори на наклон',
        name_en: 'incline push-up',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Долна част на гърдите',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Кофички на стол',
        name_en: 'chair dips',
        sets: 3,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Трицепс фокус',
      },
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Пайк лицеви опори',
        name_en: 'pike push-up',
        sets: 2,
        reps: '8-10',
        rest_seconds: 60,
        notes: 'Рамене активация',
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

  // Wednesday - Pull (Back + Biceps)
  {
    day_of_week: 3,
    name: 'Pull - Гръб, Бицепс',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Обратно гребане (с маса или лост)',
        name_en: 'inverted row',
        sets: 3,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Основно за гръб',
      },
      {
        exercisedb_id: 'bKWbrTA',
        name_bg: 'Гребане с кърпа (на врата)',
        name_en: 'towel row',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Средна част на гръб',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Бицепсово сгъване с кърпа',
        name_en: 'towel bicep curl',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Изометрична работа за бицепс',
      },
      {
        exercisedb_id: '4GqRrAk',
        name_bg: 'Супермен',
        name_en: 'superman',
        sets: 2,
        reps: '10-12',
        rest_seconds: 45,
        notes: 'Долна част на гръб',
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

  // Friday - Legs + Core
  {
    day_of_week: 5,
    name: 'Крака + Корем',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'squat',
        sets: 4,
        reps: '15',
        rest_seconds: 90,
        notes: 'Темпо 3-0-1, максимална амплитуда',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Напади',
        name_en: 'lunge',
        sets: 3,
        reps: '12/крак',
        rest_seconds: 60,
        notes: 'Алтернирайте краката',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Седалищен мост',
        name_en: 'glute bridge',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Задържане 2s горе',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '40-60s',
        rest_seconds: 45,
        notes: 'Максимално напрежение',
      },
      {
        exercisedb_id: 'tZkGYZ9',
        name_bg: "Коремни преси 'Колело'",
        name_en: 'bicycle crunch',
        sets: 2,
        reps: '20',
        rest_seconds: 30,
        notes: 'Контролирано движение',
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
