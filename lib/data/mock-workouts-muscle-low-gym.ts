/**
 * MUSCLE Program Workouts - LOW Level - GYM VERSION
 * For users with LOW muscle score (0-40 points)
 * Focus: Building foundation with weights, proper form, progressive overload
 * Frequency: 3-4 days/week
 * Duration: 45-50 minutes
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

export const MUSCLE_LOW_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Chest + Triceps
  {
    day_of_week: 1,
    name: 'Гърди + Трицепс',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Вдигане от лег с щанга (умерено)',
        name_en: 'bench press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Фокус върху форма, не тежест',
      },
      {
        exercisedb_id: 'ns0SIbU',
        name_bg: 'Вдигане от полулег с дъмбели',
        name_en: 'incline dumbbell press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Горна част на гърдите',
      },
      {
        exercisedb_id: 'FVmZVhk',
        name_bg: 'Флайс на скрипец',
        name_en: 'cable fly',
        sets: 2,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Изолация на гърди',
      },
      {
        exercisedb_id: 'qRZ5S1N',
        name_bg: 'Трицепсово разгъване на горен скрипец',
        name_en: 'tricep pushdown',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Лакти близо до тялото',
      },
      {
        exercisedb_id: '5uFK1xr',
        name_bg: 'Френска преса',
        name_en: 'overhead extension',
        sets: 2,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Дълга глава на трицепс',
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

  // Wednesday - Back + Biceps
  {
    day_of_week: 3,
    name: 'Гръб + Бицепс',
    duration: 45,
    exercises: [
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Вертикален скрипец',
        name_en: 'lat pulldown',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Широк хват',
      },
      {
        exercisedb_id: 'PQStVXH',
        name_bg: 'Гребане на долен скрипец',
        name_en: 'cable row',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Средна част на гръб',
      },
      {
        exercisedb_id: '7vG5o25',
        name_bg: 'Гребане с дъмбел',
        name_en: 'dumbbell row',
        sets: 2,
        reps: '12/ръка',
        rest_seconds: 60,
        notes: 'Едноръчно, фокус',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Бицепсово сгъване с щанга',
        name_en: 'barbell curl',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Без суинг, чист',
      },
      {
        exercisedb_id: 'slDvUAU',
        name_bg: 'Чуково сгъване с дъмбели',
        name_en: 'hammer curl',
        sets: 2,
        reps: '12',
        rest_seconds: 60,
        notes: 'Forearm + biceps',
      },
    ],
  },

  // Thursday - Rest or Light Cardio (Week 3-4)
  {
    day_of_week: 4,
    name: 'Почивка / Леко кардио',
    duration: 20,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Ходене (по желание)',
        name_en: 'walking',
        sets: 1,
        reps: '20 мин',
        rest_seconds: 0,
        notes: 'Активно възстановяване',
      },
    ],
  },

  // Friday - Legs
  {
    day_of_week: 5,
    name: 'Крака',
    duration: 50,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове с щанга',
        name_en: 'barbell squat',
        sets: 3,
        reps: '10-12',
        rest_seconds: 120,
        notes: 'Основно движение за крака',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег преса',
        name_en: 'leg press',
        sets: 3,
        reps: '12-15',
        rest_seconds: 90,
        notes: 'Допълнителен обем',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Бедрено сгъване от лег',
        name_en: 'leg curl',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Задна част',
      },
      {
        exercisedb_id: 'my33uHU',
        name_bg: 'Бедрено разгъване',
        name_en: 'leg extension',
        sets: 2,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Предна част на бедрата',
      },
      {
        exercisedb_id: 'IeDEXTe',
        name_bg: 'Повдигане за прасци на машина',
        name_en: 'calf raise',
        sets: 3,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Пълна амплитуда',
      },
    ],
  },

  // Saturday - Shoulders + Core (Week 3-4)
  {
    day_of_week: 6,
    name: 'Рамене + Корем',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменни преси с дъмбели',
        name_en: 'shoulder press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Основно за рамене',
      },
      {
        exercisedb_id: 'goJ6ezq',
        name_bg: 'Странично повдигане с дъмбели',
        name_en: 'lateral raise',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Средна глава',
      },
      {
        exercisedb_id: 'G61cXLk',
        name_bg: 'Фейс пул (дърпане към лице)',
        name_en: 'face pull',
        sets: 2,
        reps: '15',
        rest_seconds: 45,
        notes: 'Задни рамене',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '45-60s',
        rest_seconds: 45,
        notes: 'Коремна стабилизация',
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
