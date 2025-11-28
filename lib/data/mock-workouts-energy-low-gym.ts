/**
 * ENERGY Program Workouts - LOW Level - GYM VERSION
 * For users with LOW energy score (0-40 points)
 * Focus: Gentle progression with gym equipment, building cardiovascular base
 * Frequency: 2-3 days/week
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

export const ENERGY_LOW_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Light Cardio + Machines
  {
    day_of_week: 1,
    name: 'Леко кардио + Машини',
    duration: 35,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Ходене на пътека',
        name_en: 'treadmill walking',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Умерено темпо, наклон 2-3%',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег прес (лека тежест)',
        name_en: 'leg press',
        sets: 2,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Леко натоварване, фокус върху форма',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Лат пулдаун (лека тежест)',
        name_en: 'lat pulldown',
        sets: 2,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Контролирано движение',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори (на колене или наклонени)',
        name_en: 'modified push-up',
        sets: 2,
        reps: '8-10',
        rest_seconds: 60,
        notes: 'Адаптирайте според способностите',
      },
      {
        exercisedb_id: 'rjtuP6X',
        name_bg: 'Кростренажор (Елиптикал)',
        name_en: 'elliptical',
        sets: 1,
        reps: '8 мин',
        rest_seconds: 0,
        notes: 'Лека интензивност, умерено темпо',
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

  // Wednesday - Light Cardio (Week 3-4)
  {
    day_of_week: 3,
    name: 'Леко кардио',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Гребен тренажор (умерено темпо)',
        name_en: 'rowing machine',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Стабилно темпо, средна интензивност',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове (тегло на тялото)',
        name_en: 'bodyweight squat',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Бавно и контролирано',
      },
      {
        exercisedb_id: '0rHfvy9',
        name_bg: 'Кабел упражнения (леки)',
        name_en: 'cable exercises',
        sets: 2,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Chest fly или row - по избор',
      },
      {
        exercisedb_id: 'YUYAMEj',
        name_bg: 'Разпускане с фоумролер',
        name_en: 'foam rolling',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'За мобилност и възстановяване',
      },
    ],
  },

  // Thursday - Upper + Lower Light
  {
    day_of_week: 4,
    name: 'Горна + Долна част',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Загрявка на пътека',
        name_en: 'treadmill warm-up',
        sets: 1,
        reps: '5 мин',
        rest_seconds: 0,
        notes: 'Подготовка на тялото',
      },
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Бенч прес (лека тежест)',
        name_en: 'bench press',
        sets: 2,
        reps: '10',
        rest_seconds: 90,
        notes: 'Фокус върху техника, не тежест',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег прес',
        name_en: 'leg press',
        sets: 3,
        reps: '12',
        rest_seconds: 90,
        notes: 'Постепенно увеличаване на тежестта',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Лат пулдаун',
        name_en: 'lat pulldown',
        sets: 2,
        reps: '12',
        rest_seconds: 90,
        notes: 'Пълна амплитуда на движение',
      },
      {
        exercisedb_id: 'rjtuP6X',
        name_bg: 'Охлаждане на кростренажор',
        name_en: 'elliptical cool down',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Намаляващо темпо',
      },
    ],
  },

  // Friday - Light Circuit (Week 3-4)
  {
    day_of_week: 5,
    name: 'Леки кръгове',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Гребане',
        name_en: 'rowing',
        sets: 1,
        reps: '8 мин',
        rest_seconds: 0,
        notes: 'Умерено темпо',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'squat',
        sets: 2,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Възможно с леки дъмбели',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 2,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Стандартни или на колене',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '25-35s',
        rest_seconds: 45,
        notes: 'Увеличаване на издръжливост',
      },
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Охлаждащо ходене',
        name_en: 'cool down walk',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Спокойно охлаждане',
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

  // Sunday - Rest / Optional Light Activity
  {
    day_of_week: 7,
    name: 'Почивка / Леко кардио',
    duration: 20,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Лека разходка (по желание)',
        name_en: 'light walking',
        sets: 1,
        reps: '20 мин',
        rest_seconds: 0,
        notes: 'Само ако се чувствате добре и имате нужда от движение',
      },
    ],
  },
]
