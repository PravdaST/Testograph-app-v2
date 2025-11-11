/**
 * LIBIDO Program Workouts - HIGH Level - HOME VERSION
 * For users with HIGH libido score (71-100 points)
 * Focus: Advanced compounds, explosive power, maximum testosterone optimization
 * Frequency: 4-5 days/week
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

export const LIBIDO_HIGH_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Lower Body Power
  {
    day_of_week: 1,
    name: 'Долна част - Взрив',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове (високи)',
        name_en: 'high jump squat',
        sets: 5,
        reps: '15',
        rest_seconds: 60,
        notes: 'Максимална височина, пълна амплитуда',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Пистол клекове (асистирани)',
        name_en: 'pistol squat',
        sets: 4,
        reps: '8/крак',
        rest_seconds: 90,
        notes: 'С минимална помощ',
      },
      {
        exercisedb_id: 'aWedzZX',
        name_bg: 'Мост на един крак (напреднал)',
        name_en: 'advanced single leg bridge',
        sets: 5,
        reps: '15/крак',
        rest_seconds: 45,
        notes: 'Задържане 3s горе, пълно свиване',
      },
      {
        exercisedb_id: 'PM1PZjg',
        name_bg: 'Скокови напади',
        name_en: 'jumping lunge',
        sets: 4,
        reps: '20 (10/крак)',
        rest_seconds: 45,
        notes: 'Експлозивна смяна',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове с темп (тежки)',
        name_en: 'tempo squat',
        sets: 4,
        reps: '20',
        rest_seconds: 60,
        notes: '3-0-1 темпо, максимална дълбочина',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Глутеус мост (изометричен)',
        name_en: 'isometric glute bridge',
        sets: 3,
        reps: '60s',
        rest_seconds: 45,
        notes: 'Максимално свиване през цялото време',
      },
    ],
  },

  // Tuesday - Upper Body + Core
  {
    day_of_week: 2,
    name: 'Горна част + Корем',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори (напреднали вариации)',
        name_en: 'advanced push-up variations',
        sets: 5,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Диамантени, плайо, archer',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Австралийски лост',
        name_en: 'inverted row',
        sets: 5,
        reps: '15',
        rest_seconds: 60,
        notes: 'Максимално свиване на гръб',
      },
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Пайк опори (дълбоки)',
        name_en: 'pike push-up',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Максимална амплитуда',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Дипс (напреднал)',
        name_en: 'advanced dips',
        sets: 4,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Ако е лесно, повдигни краката',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк с движение',
        name_en: 'dynamic plank',
        sets: 4,
        reps: '60s',
        rest_seconds: 45,
        notes: 'Алтернирайте вариации',
      },
    ],
  },

  // Wednesday - Rest
  {
    day_of_week: 3,
    name: 'Почивка',
    duration: 0,
    exercises: [],
  },

  // Thursday - Full Body Compound
  {
    day_of_week: 4,
    name: 'Цяло тяло - Съставни',
    duration: 65,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита (тежки)',
        name_en: 'burpee',
        sets: 5,
        reps: '15',
        rest_seconds: 60,
        notes: 'Пълна амплитуда, без пауза',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове (високо повторение)',
        name_en: 'high rep squat',
        sets: 5,
        reps: '25',
        rest_seconds: 60,
        notes: 'Непрекъснато темпо',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори (експлозивни)',
        name_en: 'explosive push-up',
        sets: 5,
        reps: '15',
        rest_seconds: 60,
        notes: 'Ръцете напускат земята',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове',
        name_en: 'jump squat',
        sets: 5,
        reps: '20',
        rest_seconds: 45,
        notes: 'Максимална експлозивност',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Гребане (маса)',
        name_en: 'table row',
        sets: 4,
        reps: '20',
        rest_seconds: 45,
        notes: 'Пълна амплитуда',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Мост (единичен крак)',
        name_en: 'single leg bridge',
        sets: 4,
        reps: '15/крак',
        rest_seconds: 30,
        notes: 'Бърз ритъм',
      },
    ],
  },

  // Friday - Lower Body Volume
  {
    day_of_week: 5,
    name: 'Долна част - Обем',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове (пирамида)',
        name_en: 'pyramid squat',
        sets: 5,
        reps: '20-15-12-15-20',
        rest_seconds: 60,
        notes: 'Променлив темп според повторенията',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Напади (ходещи)',
        name_en: 'walking lunge',
        sets: 5,
        reps: '20/крак',
        rest_seconds: 60,
        notes: 'Контролирано темпо',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове (сет)',
        name_en: 'jump squat set',
        sets: 4,
        reps: '15',
        rest_seconds: 45,
        notes: 'След всеки сет обикновени клекове',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Глутеус мост (двукрак тежък)',
        name_en: 'weighted glute bridge',
        sets: 5,
        reps: '20',
        rest_seconds: 45,
        notes: 'Нещо тежко на корема ако е възможно',
      },
      {
        exercisedb_id: '2ORFMoR',
        name_bg: 'Прасци (единичен крак)',
        name_en: 'single leg calf raise',
        sets: 4,
        reps: '20/крак',
        rest_seconds: 30,
        notes: 'Пълна амплитуда, задържане 2s горе',
      },
    ],
  },

  // Saturday - HIIT + Core (Week 3-4)
  {
    day_of_week: 6,
    name: 'HIIT + Корем',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита (табата)',
        name_en: 'burpee tabata',
        sets: 8,
        reps: '20s / 10s',
        rest_seconds: 10,
        notes: '4 минути максимален интензитет',
      },
      {
        exercisedb_id: 'Fey3oVx',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '40',
        rest_seconds: 30,
        notes: 'Високо темпо',
      },
      {
        exercisedb_id: 'tZkGYZ9',
        name_bg: 'Колело коремни',
        name_en: 'bicycle crunch',
        sets: 4,
        reps: '40',
        rest_seconds: 30,
        notes: 'Контролирано',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (комбо)',
        name_en: 'plank combo',
        sets: 3,
        reps: '90s',
        rest_seconds: 60,
        notes: 'Различни вариации',
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
