/**
 * ENERGY Program Workouts - LOW Level - HOME VERSION
 * For users with LOW energy score (0-40 points)
 * Focus: Gentle progression, building foundation, sustainable energy
 * Frequency: 2-3 days/week
 * Duration: 30-40 minutes
 * Intensity: 60-70% of max effort
 *
 * Week 1-2: 2 workouts (Monday, Thursday)
 * Week 3-4: 3 workouts (Monday, Wednesday, Friday) - progressive increase
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

export const ENERGY_LOW_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Light Full Body Movement
  {
    day_of_week: 1,
    name: 'Леко движение - Цяло тяло',
    duration: 30,
    exercises: [
      {
        exercisedb_id: 'walking',
        name_bg: 'Загряващо ходене на място',
        name_en: 'walking in place',
        sets: 1,
        reps: '5 мин',
        rest_seconds: 0,
        notes: 'Умерено темпо, загряване на тялото',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Леки клекове',
        name_en: 'bodyweight squat',
        sets: 2,
        reps: '8-10',
        rest_seconds: 60,
        notes: 'Бавно и контролирано, фокус върху форма',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори на колене',
        name_en: 'knee push-up',
        sets: 2,
        reps: '6-8',
        rest_seconds: 60,
        notes: 'Алтернатива на стандартните опори',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (леко)',
        name_en: 'plank',
        sets: 2,
        reps: '15-20s',
        rest_seconds: 45,
        notes: 'Задържане в позиция, силен корем',
      },
      {
        exercisedb_id: '1jXLYEw',
        name_bg: 'Разтягане за разпускане',
        name_en: 'stretching',
        sets: 1,
        reps: '5 мин',
        rest_seconds: 0,
        notes: 'Леко разтягане на основните мускулни групи',
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

  // Wednesday - Active Recovery (Week 3-4 only)
  {
    day_of_week: 3,
    name: 'Активно възстановяване',
    duration: 35,
    exercises: [
      {
        exercisedb_id: 'walking',
        name_bg: 'Бързо ходене',
        name_en: 'brisk walking',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Леко повишено темпо спрямо седмица 1-2',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Добавяме 1 сет повече',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Австралийски лост (маса)',
        name_en: 'inverted row',
        sets: 2,
        reps: '6-8',
        rest_seconds: 60,
        notes: 'Използвайте маса или нисък бар',
      },
      {
        exercisedb_id: 'bWlZvXh',
        name_bg: 'Йога за разпускане',
        name_en: 'yoga stretches',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Съсредоточение върху дишане и баланс',
      },
    ],
  },

  // Thursday - Light Cardio + Strength
  {
    day_of_week: 4,
    name: 'Кардио + Сила',
    duration: 35,
    exercises: [
      {
        exercisedb_id: 'eL6Lz0v',
        name_bg: 'Високи колене (леко)',
        name_en: 'high knees',
        sets: 2,
        reps: '30s',
        rest_seconds: 45,
        notes: 'Умерено темпо, не форсирайте',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 3,
        reps: '10',
        rest_seconds: 60,
        notes: 'Стабилно темпо',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 2,
        reps: '8-10',
        rest_seconds: 60,
        notes: 'На колене ако е нужно',
      },
      {
        exercisedb_id: 'RRWFUcw',
        name_bg: 'Планк странично',
        name_en: 'side plank',
        sets: 2,
        reps: '15s/страна',
        rest_seconds: 30,
        notes: 'Алтернирайте страните',
      },
      {
        exercisedb_id: 'walking',
        name_bg: 'Охлаждащо ходене',
        name_en: 'cool down walk',
        sets: 1,
        reps: '5 мин',
        rest_seconds: 0,
        notes: 'Бавно намаляване на пулса',
      },
    ],
  },

  // Friday - Light Movement (Week 3-4 only)
  {
    day_of_week: 5,
    name: 'Леко движение',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'walking',
        name_bg: 'Интервално ходене',
        name_en: 'interval walking',
        sets: 1,
        reps: '15 мин',
        rest_seconds: 0,
        notes: '1мин бързо, 2мин бавно - повторете',
      },
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Леки бърпита (половин амплитуда)',
        name_en: 'modified burpee',
        sets: 2,
        reps: '6-8',
        rest_seconds: 60,
        notes: 'Без скок, контролирано движение',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '20-30s',
        rest_seconds: 45,
        notes: 'Постепенно увеличаване на времето',
      },
      {
        exercisedb_id: '1jXLYEw',
        name_bg: 'Цялостно разтягане за край',
        name_en: 'full body stretch',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Релаксация и възстановяване',
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

  // Sunday - Rest / Light Stretching
  {
    day_of_week: 7,
    name: 'Почивка / Разтягане',
    duration: 15,
    exercises: [
      {
        exercisedb_id: 'bWlZvXh',
        name_bg: 'Йога или стречинг (по желание)',
        name_en: 'yoga or stretching',
        sets: 1,
        reps: '15 мин',
        rest_seconds: 0,
        notes: 'Леко, спокойно, ако се чувствате добре',
      },
    ],
  },
]
