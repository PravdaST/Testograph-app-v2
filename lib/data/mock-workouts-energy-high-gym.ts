/**
 * ENERGY Program Workouts - HIGH Level - GYM VERSION
 * For users with HIGH energy score (71-100 points)
 * Focus: High-intensity equipment work, maximum cardiovascular performance
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

export const ENERGY_HIGH_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Battle Ropes + HIIT Circuit
  {
    day_of_week: 1,
    name: 'Бойни въжета + HIIT',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'RJa4tCo',
        name_bg: 'Бойни въжета (вълни)',
        name_en: 'battle ropes waves',
        sets: 5,
        reps: '40s',
        rest_seconds: 30,
        notes: 'Максимален интензитет',
      },
      {
        exercisedb_id: 'iPm26QU',
        name_bg: 'Скокове на кутия',
        name_en: 'box jump',
        sets: 5,
        reps: '15',
        rest_seconds: 45,
        notes: 'Взривен скок, меко кацане',
      },
      {
        exercisedb_id: 'UHJlbu3',
        name_bg: 'Кетълбел суинг',
        name_en: 'kettlebell swing',
        sets: 5,
        reps: '20',
        rest_seconds: 30,
        notes: 'Експлозивно движение от ханша',
      },
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Гребане (интервали)',
        name_en: 'rowing intervals',
        sets: 4,
        reps: '500m спринт',
        rest_seconds: 60,
        notes: 'Максимален темп под 2 мин',
      },
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 4,
        reps: '15',
        rest_seconds: 30,
        notes: 'Непрекъснато темпо',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк на TRX',
        name_en: 'TRX plank',
        sets: 3,
        reps: '60s',
        rest_seconds: 45,
        notes: 'Нестабилна повърхност',
      },
    ],
  },

  // Tuesday - Assault Bike + Strength
  {
    day_of_week: 2,
    name: 'Assault Bike + Сила',
    duration: 55,
    exercises: [
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Assault bike (табата)',
        name_en: 'assault bike tabata',
        sets: 8,
        reps: '20s спринт / 10s почивка',
        rest_seconds: 10,
        notes: 'Максимален интензитет 4 мин',
      },
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Барбел клекове (умерена тежест)',
        name_en: 'barbell squat',
        sets: 4,
        reps: '12',
        rest_seconds: 60,
        notes: 'Експлозивно нагоре',
      },
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Бенч прес',
        name_en: 'bench press',
        sets: 4,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Контролирано, умерена тежест',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Лат пулдаун',
        name_en: 'lat pulldown',
        sets: 4,
        reps: '12',
        rest_seconds: 45,
        notes: 'Пълна амплитуда',
      },
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Охлаждане на Assault Bike',
        name_en: 'assault bike cool down',
        sets: 1,
        reps: '5 мин',
        rest_seconds: 0,
        notes: 'Плавно намаляване на темпото',
      },
    ],
  },

  // Wednesday - Rowing + Battle Ropes
  {
    day_of_week: 3,
    name: 'Гребане + Бойни въжета',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Гребане (интервали 2K)',
        name_en: 'rowing 2K intervals',
        sets: 4,
        reps: '500m',
        rest_seconds: 90,
        notes: 'Под 2:00/500m темп',
      },
      {
        exercisedb_id: 'RJa4tCo',
        name_bg: 'Бойни въжета (алтернатива)',
        name_en: 'battle ropes alternating',
        sets: 5,
        reps: '45s',
        rest_seconds: 30,
        notes: 'Различни вариации',
      },
      {
        exercisedb_id: 'UHJlbu3',
        name_bg: 'Кетълбел суинг (тежък)',
        name_en: 'heavy kettlebell swing',
        sets: 5,
        reps: '15',
        rest_seconds: 45,
        notes: '24-32kg ако е възможно',
      },
      {
        exercisedb_id: 'iPm26QU',
        name_bg: 'Скокове на кутия',
        name_en: 'box jump',
        sets: 4,
        reps: '12',
        rest_seconds: 45,
        notes: 'Висока кутия - взривност',
      },
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита с тежест',
        name_en: 'weighted burpee',
        sets: 4,
        reps: '12',
        rest_seconds: 45,
        notes: 'Дъмбел или жилетка',
      },
    ],
  },

  // Thursday - Treadmill Sprints + Circuits
  {
    day_of_week: 4,
    name: 'Спринтове + Кръгове',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'rjiM4L3',
        name_bg: 'Пътека спринтове',
        name_en: 'treadmill sprint',
        sets: 8,
        reps: '30s спринт / 30s почивка',
        rest_seconds: 30,
        notes: 'Наклон 5-8%, висока скорост',
      },
      {
        exercisedb_id: 'yn2lLSI',
        name_bg: 'Тласкане на шейна (ако има)',
        name_en: 'sled push',
        sets: 4,
        reps: '20m',
        rest_seconds: 60,
        notes: 'Тежка тежест, максимално усилие',
      },
      {
        exercisedb_id: 'RJa4tCo',
        name_bg: 'Бойни въжета (слам)',
        name_en: 'battle ropes slam',
        sets: 4,
        reps: '30s',
        rest_seconds: 30,
        notes: 'Вдигане и удар надолу',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове',
        name_en: 'jump squat',
        sets: 4,
        reps: '20',
        rest_seconds: 30,
        notes: 'Непрекъснато',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк с тегла (рене)',
        name_en: 'plank dumbbell row',
        sets: 3,
        reps: '20 (10/ръка)',
        rest_seconds: 30,
        notes: 'Стабилен корем под движение',
      },
    ],
  },

  // Friday - Full Body Power Day
  {
    day_of_week: 5,
    name: 'Цяло тяло - Взрив',
    duration: 65,
    exercises: [
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Загрявка на Assault Bike',
        name_en: 'assault bike warm-up',
        sets: 1,
        reps: '5 мин',
        rest_seconds: 0,
        notes: 'Постепенно увеличаване на интензивността',
      },
      {
        exercisedb_id: 'SGY8Zui',
        name_bg: 'Барбел клийн (лек)',
        name_en: 'barbell clean',
        sets: 5,
        reps: '8',
        rest_seconds: 90,
        notes: 'Експлозивна техника',
      },
      {
        exercisedb_id: 'iPm26QU',
        name_bg: 'Скокове на кутия (висока)',
        name_en: 'high box jump',
        sets: 5,
        reps: '10',
        rest_seconds: 60,
        notes: 'Максимална височина',
      },
      {
        exercisedb_id: 'UHJlbu3',
        name_bg: 'Кетълбел суинг',
        name_en: 'kettlebell swing',
        sets: 5,
        reps: '25',
        rest_seconds: 45,
        notes: 'Бърз ритъм',
      },
      {
        exercisedb_id: 'RJa4tCo',
        name_bg: 'Бойни въжета (комбо)',
        name_en: 'battle ropes combo',
        sets: 4,
        reps: '60s',
        rest_seconds: 45,
        notes: 'Различни движения',
      },
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Гребане (финишер)',
        name_en: 'rowing finisher',
        sets: 1,
        reps: '1000m',
        rest_seconds: 0,
        notes: 'Максимален темп - под 4 мин',
      },
    ],
  },

  // Saturday - Active Recovery / Light Cardio
  {
    day_of_week: 6,
    name: 'Активно възстановяване',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'rjtuP6X',
        name_bg: 'Кростренажор (Елиптикал)',
        name_en: 'elliptical',
        sets: 1,
        reps: '20 мин',
        rest_seconds: 0,
        notes: 'Умерено темпо, Zone 2',
      },
      {
        exercisedb_id: 'YUYAMEj',
        name_bg: 'Разпускане с фоумролер',
        name_en: 'foam rolling',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'За всички основни мускулни групи',
      },
      {
        exercisedb_id: '1jXLYEw',
        name_bg: 'Статично разтягане',
        name_en: 'stretching',
        sets: 1,
        reps: '10 мин',
        rest_seconds: 0,
        notes: 'Мобилност и гъвкавост',
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
