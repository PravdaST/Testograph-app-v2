/**
 * LIBIDO Program Workouts - HIGH Level - GYM VERSION
 * For users with HIGH libido score (71-100 points)
 * Focus: Heavy compounds, power movements, maximum testosterone production
 * Frequency: 4-5 days/week
 * Duration: 60-70 minutes
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

export const LIBIDO_HIGH_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Heavy Lower Body
  {
    day_of_week: 1,
    name: 'Тежка долна част',
    duration: 65,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Барбел клекове (тежки)',
        name_en: 'heavy barbell squat',
        sets: 5,
        reps: '5-8',
        rest_seconds: 180,
        notes: '80-90% от max, пълна амплитуда',
      },
      {
        exercisedb_id: 'GUT8I22',
        name_bg: 'Мъртва тяга',
        name_en: 'deadlift',
        sets: 4,
        reps: '6',
        rest_seconds: 180,
        notes: '80-85% от max, перфектна форма',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег прес (тежък)',
        name_en: 'heavy leg press',
        sets: 4,
        reps: '10',
        rest_seconds: 90,
        notes: 'Максимален товар, контролирано',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Лег къръл',
        name_en: 'leg curl',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Задна част на бедрата',
      },
      {
        exercisedb_id: 'IeDEXTe',
        name_bg: 'Прасци (тежки)',
        name_en: 'heavy calf raise',
        sets: 4,
        reps: '15',
        rest_seconds: 45,
        notes: 'Пълна амплитуда, задържане горе',
      },
    ],
  },

  // Tuesday - Upper Body Power
  {
    day_of_week: 2,
    name: 'Горна част - Сила',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Бенч прес (тежък)',
        name_en: 'heavy bench press',
        sets: 5,
        reps: '5-8',
        rest_seconds: 180,
        notes: '80-90% от max, експлозивно нагоре',
      },
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Барбел гребане',
        name_en: 'barbell row',
        sets: 4,
        reps: '8-10',
        rest_seconds: 120,
        notes: 'Тежък товар, чист',
      },
      {
        exercisedb_id: 'u4bAmKp',
        name_bg: 'Раменна прес стоеща',
        name_en: 'overhead press',
        sets: 4,
        reps: '8',
        rest_seconds: 120,
        notes: 'Строга форма, без импулс',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Лат пулдаун (тежък)',
        name_en: 'heavy lat pulldown',
        sets: 4,
        reps: '10',
        rest_seconds: 90,
        notes: 'Широк хват, пълна амплитуда',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Барбел къръл',
        name_en: 'barbell curl',
        sets: 3,
        reps: '10',
        rest_seconds: 60,
        notes: 'Строга форма',
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

  // Thursday - Lower Body Volume
  {
    day_of_week: 4,
    name: 'Долна част - Обем',
    duration: 65,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Барбел клекове (обем)',
        name_en: 'volume barbell squat',
        sets: 4,
        reps: '10-12',
        rest_seconds: 120,
        notes: '70-75% от max, контролирано',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег прес',
        name_en: 'leg press',
        sets: 4,
        reps: '15',
        rest_seconds: 90,
        notes: 'Умерен товар, пълна амплитуда',
      },
      {
        exercisedb_id: 'wQ2c4XD',
        name_bg: 'Румънска мъртва тяга',
        name_en: 'romanian deadlift',
        sets: 4,
        reps: '12',
        rest_seconds: 90,
        notes: 'Задна верига',
      },
      {
        exercisedb_id: 'my33uHU',
        name_bg: 'Лег екстеншън',
        name_en: 'leg extension',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Предна част на бедрата',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Лег къръл',
        name_en: 'leg curl',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Задна част на бедрата',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (дълъг)',
        name_en: 'long plank hold',
        sets: 3,
        reps: '90s',
        rest_seconds: 60,
        notes: 'Коремна стабилизация',
      },
    ],
  },

  // Friday - Upper Body Hypertrophy
  {
    day_of_week: 5,
    name: 'Горна част - Хипертрофия',
    duration: 70,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Бенч прес',
        name_en: 'bench press',
        sets: 4,
        reps: '10',
        rest_seconds: 90,
        notes: '75% от max, контролирано',
      },
      {
        exercisedb_id: 'ns0SIbU',
        name_bg: 'Наклонена прес с дъмбели',
        name_en: 'incline dumbbell press',
        sets: 4,
        reps: '12',
        rest_seconds: 90,
        notes: 'Горна част на гърдите',
      },
      {
        exercisedb_id: 'PQStVXH',
        name_bg: 'Кабел гребане',
        name_en: 'cable row',
        sets: 4,
        reps: '12',
        rest_seconds: 75,
        notes: 'Средна част на гръб',
      },
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменна прес с дъмбели',
        name_en: 'dumbbell shoulder press',
        sets: 4,
        reps: '12',
        rest_seconds: 75,
        notes: 'Пълна амплитуда',
      },
      {
        exercisedb_id: 'goJ6ezq',
        name_bg: 'Странични махове',
        name_en: 'lateral raise',
        sets: 4,
        reps: '15',
        rest_seconds: 45,
        notes: 'Средна глава на рамо',
      },
      {
        exercisedb_id: 'qRZ5S1N',
        name_bg: 'Трицепс пушдаун',
        name_en: 'tricep pushdown',
        sets: 3,
        reps: '15',
        rest_seconds: 45,
        notes: 'Изолация на трицепс',
      },
      {
        exercisedb_id: 'slDvUAU',
        name_bg: 'Чук къръл',
        name_en: 'hammer curl',
        sets: 3,
        reps: '12',
        rest_seconds: 45,
        notes: 'Brachialis работа',
      },
    ],
  },

  // Saturday - Power + Conditioning (Week 3-4)
  {
    day_of_week: 6,
    name: 'Взрив + Кондиция',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'SGY8Zui',
        name_bg: 'Барбел клийн',
        name_en: 'barbell clean',
        sets: 5,
        reps: '5',
        rest_seconds: 120,
        notes: 'Експлозивна техника',
      },
      {
        exercisedb_id: 'iPm26QU',
        name_bg: 'Скокове на кутия',
        name_en: 'box jump',
        sets: 4,
        reps: '10',
        rest_seconds: 60,
        notes: 'Максимална височина',
      },
      {
        exercisedb_id: 'UHJlbu3',
        name_bg: 'Кетълбел суинг (тежък)',
        name_en: 'heavy kettlebell swing',
        sets: 5,
        reps: '20',
        rest_seconds: 60,
        notes: '24-32kg ако е възможно',
      },
      {
        exercisedb_id: 'qPEzJjA',
        name_bg: 'Фермер ход',
        name_en: 'farmer walk',
        sets: 4,
        reps: '40m',
        rest_seconds: 90,
        notes: 'Тежки дъмбели/кетълбели',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (тежък)',
        name_en: 'weighted plank',
        sets: 3,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Тегло на гърба',
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
