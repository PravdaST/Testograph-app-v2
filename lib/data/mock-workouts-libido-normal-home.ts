/**
 * LIBIDO Program Workouts - HOME VERSION
 * Focus: Bodyweight compound movements, testosterone-boosting exercises
 * 3-4 days/week, no equipment needed
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

export const LIBIDO_NORMAL_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Lower Body Power
  {
    day_of_week: 1,
    name: 'Долна част - Сила',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове с тегло на тялото',
        name_en: 'bodyweight squat',
        sets: 5,
        reps: '15-20',
        rest_seconds: 90,
        notes: 'Бавно надолу (3 сек), експлозивно нагоре. Стимулира тестостерон.',
      },
      {
        exercisedb_id: '5bpPTHv',
        name_bg: 'Пистолет клекове',
        name_en: 'pistol squat',
        sets: 4,
        reps: '8-10 на крак',
        rest_seconds: 90,
        notes: 'Напреднало упражнение за сила и баланс.',
      },
      {
        exercisedb_id: 'IZVHb27',
        name_bg: 'Ходещи напади',
        name_en: 'walking lunge',
        sets: 4,
        reps: '12-15 на крак',
        rest_seconds: 60,
        notes: 'Поддържа високото натоварване на краката.',
      },
      {
        exercisedb_id: 'rmEukuS',
        name_bg: 'Седалищен мост на един крак',
        name_en: 'single leg glute bridge',
        sets: 4,
        reps: '12-15 на крак',
        rest_seconds: 60,
        notes: 'Активира седалищните мускули - важно за тестостерон.',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скок клекове',
        name_en: 'jump squat',
        sets: 3,
        reps: '12-15',
        rest_seconds: 90,
        notes: 'Плиометрия за експлозивна сила.',
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

  // Wednesday - Upper Body Strength
  {
    day_of_week: 3,
    name: 'Горна част - Сила',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 5,
        reps: '15-20',
        rest_seconds: 90,
        notes: 'Ако е лесно, пробвай diamond push-ups.',
      },
      {
        exercisedb_id: 'i5cEhka',
        name_bg: 'Лицеви опори с повдигнати крака',
        name_en: 'decline push-up',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Повишава натоварването на гръдния кош.',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Набирания (или обратно гребане)',
        name_en: 'pull-up or inverted row',
        sets: 4,
        reps: '8-12',
        rest_seconds: 90,
        notes: 'Ако нямате лост, използвай маса за австралийски лост.',
      },
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Пайк лицеви опори',
        name_en: 'pike push-up',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива рамене без тегла.',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Кофички на стол',
        name_en: 'chair dips',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Използвай стол или диван.',
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

  // Friday - Full Body Circuit
  {
    day_of_week: 5,
    name: 'Пълно тяло - Кръгова тренировка',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Пълно тяло, високо кардио. Стимулира хормони.',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 4,
        reps: '20-25',
        rest_seconds: 45,
        notes: 'Високо повторение.',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 4,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Бързо темпо.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 4,
        reps: '40-50',
        rest_seconds: 45,
        notes: 'Кардио + корем.',
      },
      {
        exercisedb_id: 'PM1PZjg',
        name_bg: 'Скокови напади',
        name_en: 'jump lunge',
        sets: 3,
        reps: '10-12 на крак',
        rest_seconds: 60,
        notes: 'Експлозивна сила за долна част.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '45-60s',
        rest_seconds: 60,
        notes: 'Задържане на стабилност.',
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

