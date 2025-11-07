/**
 * ENERGY Program Workouts - GYM VERSION
 * Focus: Cardio machines, functional training, explosive movements, endurance
 * 4-5 days/week with access to gym equipment
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

export const ENERGY_NORMAL_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Cardio + Lower Body Strength
  {
    day_of_week: 1,
    name: 'Кардио + Долна част',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Бягаща пътека - интервали',
        name_en: 'treadmill intervals',
        sets: 1,
        reps: '15мин',
        rest_seconds: 0,
        notes: '2мин умерено, 1мин спринт - 5 цикъла. Повишава издръжливостта.',
      },
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове с щанга',
        name_en: 'barbell squat',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Развива експлозивна сила в краката.',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Преса за крака',
        name_en: 'leg press',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Високо повторение за издръжливост.',
      },
      {
        exercisedb_id: 'RRWFUcw',
        name_bg: 'Напади с дъмбели',
        name_en: 'dumbbell lunge',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Функционално движение за баланс.',
      },
      {
        exercisedb_id: 'iPm26QU',
        name_bg: 'Скокове на кутия',
        name_en: 'box jump',
        sets: 3,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Плиометрия за взривна сила и енергия.',
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
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Гребен тренажор',
        name_en: 'rowing machine',
        sets: 1,
        reps: '20мин',
        rest_seconds: 0,
        notes: 'Умерено темпо за възстановяване.',
      },
      {
        exercisedb_id: 'YUYAMEj',
        name_bg: 'Foam Rolling',
        name_en: 'foam rolling',
        sets: 1,
        reps: '10мин',
        rest_seconds: 0,
        notes: 'Мобилност и възстановяване на мускулите.',
      },
    ],
  },

  // Wednesday - HIIT Circuits
  {
    day_of_week: 3,
    name: 'HIIT Кръгова тренировка',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'UHJlbu3',
        name_bg: 'Battle Ropes',
        name_en: 'battle ropes',
        sets: 4,
        reps: '30s',
        rest_seconds: 30,
        notes: 'Максимална интензивност за 30 секунди.',
      },
      {
        exercisedb_id: 'UHJlbu3',
        name_bg: 'Махове с кетълбел',
        name_en: 'kettlebell swing',
        sets: 4,
        reps: '15-20',
        rest_seconds: 30,
        notes: 'Експлозивно движение от бедрата.',
      },
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 4,
        reps: '12-15',
        rest_seconds: 45,
        notes: 'Пълно тяло, високо кардио натоварване.',
      },
      {
        exercisedb_id: 'oHg8eop',
        name_bg: 'Удари с медицинска топка',
        name_en: 'medicine ball slam',
        sets: 4,
        reps: '15-20',
        rest_seconds: 30,
        notes: 'Освобождава стрес, взривна сила.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '40-50',
        rest_seconds: 45,
        notes: 'Кардио + корем комбинация.',
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

  // Friday - Upper Body + Cardio Finisher
  {
    day_of_week: 5,
    name: 'Горна част + Кардио финал',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Лежанка със щанга',
        name_en: 'barbell bench press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Умерени тегла, фокус върху форма.',
      },
      {
        exercisedb_id: 'BJ0Hz5L',
        name_bg: 'Гребане с дъмбели',
        name_en: 'dumbbell bent over row',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива гръб и осанка.',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Издърпване на лат машина',
        name_en: 'lat pulldown',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Широчина на гърба.',
      },
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменни преси',
        name_en: 'dumbbell shoulder press',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Изгражда рамене.',
      },
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Assault Bike Финал',
        name_en: 'assault bike',
        sets: 1,
        reps: '10мин',
        rest_seconds: 0,
        notes: 'Интервали: 20s спринт, 40s умерено - завършва тренировката.',
      },
    ],
  },

  // Saturday - Cardio Steady State
  {
    day_of_week: 6,
    name: 'Стационарно кардио',
    duration: 35,
    exercises: [
      {
        exercisedb_id: 'rjtuP6X',
        name_bg: 'Елиптична машина',
        name_en: 'elliptical',
        sets: 1,
        reps: '30мин',
        rest_seconds: 0,
        notes: 'Умерено темпо за активно възстановяване.',
      },
      {
        exercisedb_id: '1jXLYEw',
        name_bg: 'Разтягане',
        name_en: 'stretching',
        sets: 1,
        reps: '5мин',
        rest_seconds: 0,
        notes: 'Динамично разтягане.',
      },
    ],
  },

  // Sunday - Почивка
  {
    day_of_week: 7,
    name: 'Пълна почивка',
    duration: 0,
    exercises: [],
  },
]

