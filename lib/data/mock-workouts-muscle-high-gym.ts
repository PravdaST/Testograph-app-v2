/**
 * MUSCLE Program Workouts - HIGH Level - GYM VERSION
 * For users with HIGH muscle score (71-100 points)
 * Focus: Advanced hypertrophy, high volume, progressive overload
 * Frequency: 6 days/week (aggressive bodybuilding split)
 * Duration: 65-75 minutes
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

export const MUSCLE_HIGH_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Chest + Triceps
  {
    day_of_week: 1,
    name: 'Гърди + Трицепс',
    duration: 70,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Барбел бенч прес',
        name_en: 'barbell bench press',
        sets: 5,
        reps: '8-10',
        rest_seconds: 120,
        notes: 'Основно движение, прогресивно натоварване',
      },
      {
        exercisedb_id: 'ns0SIbU',
        name_bg: 'Наклонена прес с дъмбели',
        name_en: 'incline dumbbell press',
        sets: 4,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Горна част на гърдите',
      },
      {
        exercisedb_id: 'FVmZVhk',
        name_bg: 'Кабел флай',
        name_en: 'cable fly',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Непрекъснато напрежение',
      },
      {
        exercisedb_id: 'yz9nUhF',
        name_bg: 'Дъмбел флай',
        name_en: 'dumbbell fly',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Стречинг под натоварване',
      },
      {
        exercisedb_id: 'WcHl7ru',
        name_bg: 'Тесен хват бенч',
        name_en: 'close grip bench press',
        sets: 4,
        reps: '10',
        rest_seconds: 90,
        notes: 'Трицепс масова работа',
      },
      {
        exercisedb_id: 'qRZ5S1N',
        name_bg: 'Трицепс пушдаун',
        name_en: 'tricep pushdown',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Изолация, пълна амплитуда',
      },
      {
        exercisedb_id: '5uFK1xr',
        name_bg: 'Френска прес',
        name_en: 'overhead extension',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Дълга глава на трицепс',
      },
    ],
  },

  // Tuesday - Back + Biceps
  {
    day_of_week: 2,
    name: 'Гръб + Бицепс',
    duration: 70,
    exercises: [
      {
        exercisedb_id: 'GUT8I22',
        name_bg: 'Мъртва тяга',
        name_en: 'deadlift',
        sets: 4,
        reps: '6-8',
        rest_seconds: 180,
        notes: 'Основно за цял гръб',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Лат пулдаун',
        name_en: 'lat pulldown',
        sets: 4,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Широк хват',
      },
      {
        exercisedb_id: 'dmgMp3n',
        name_bg: 'Барбел гребане',
        name_en: 'barbell row',
        sets: 4,
        reps: '10',
        rest_seconds: 90,
        notes: 'Средна част на гръб',
      },
      {
        exercisedb_id: 'PQStVXH',
        name_bg: 'Кабел гребане',
        name_en: 'cable row',
        sets: 4,
        reps: '12',
        rest_seconds: 75,
        notes: 'Различни хватове',
      },
      {
        exercisedb_id: '7vG5o25',
        name_bg: 'Едноръчно гребане с дъмбел',
        name_en: 'single arm dumbbell row',
        sets: 3,
        reps: '12/ръка',
        rest_seconds: 60,
        notes: 'Фокус върху свиване',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Барбел къръл',
        name_en: 'barbell curl',
        sets: 4,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Строга форма',
      },
      {
        exercisedb_id: 'slDvUAU',
        name_bg: 'Чук къръл',
        name_en: 'hammer curl',
        sets: 4,
        reps: '12',
        rest_seconds: 60,
        notes: 'Brachialis и forearm',
      },
      {
        exercisedb_id: 'b6hQYMb',
        name_bg: 'Прийчър къръл',
        name_en: 'preacher curl',
        sets: 3,
        reps: '12-15',
        rest_seconds: 45,
        notes: 'Изолация на бицепс',
      },
    ],
  },

  // Wednesday - Legs
  {
    day_of_week: 3,
    name: 'Крака',
    duration: 75,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Барбел клекове',
        name_en: 'barbell squat',
        sets: 5,
        reps: '8-10',
        rest_seconds: 180,
        notes: 'Основно движение за крака',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Лег прес',
        name_en: 'leg press',
        sets: 4,
        reps: '12-15',
        rest_seconds: 90,
        notes: 'Висок обем',
      },
      {
        exercisedb_id: 'wQ2c4XD',
        name_bg: 'Румънска мъртва тяга',
        name_en: 'romanian deadlift',
        sets: 4,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Задна верига',
      },
      {
        exercisedb_id: 'my33uHU',
        name_bg: 'Лег екстеншън',
        name_en: 'leg extension',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Изолация на квадрицепс',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Лег къръл',
        name_en: 'leg curl',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Задна част на бедрата',
      },
      {
        exercisedb_id: 'IeDEXTe',
        name_bg: 'Прасци на машина',
        name_en: 'calf raise machine',
        sets: 5,
        reps: '20',
        rest_seconds: 45,
        notes: 'Пълна амплитуда, задържане горе',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (тежък)',
        name_en: 'weighted plank',
        sets: 4,
        reps: '75s',
        rest_seconds: 60,
        notes: 'Тегло на гръб',
      },
    ],
  },

  // Thursday - Shoulders + Abs
  {
    day_of_week: 4,
    name: 'Рамене + Коремни',
    duration: 65,
    exercises: [
      {
        exercisedb_id: 'u4bAmKp',
        name_bg: 'Раменна прес стоеща',
        name_en: 'standing overhead press',
        sets: 5,
        reps: '8-10',
        rest_seconds: 120,
        notes: 'Основно за рамене',
      },
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Седнала прес с дъмбели',
        name_en: 'seated dumbbell press',
        sets: 4,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Пълна амплитуда',
      },
      {
        exercisedb_id: 'goJ6ezq',
        name_bg: 'Странични махове',
        name_en: 'lateral raise',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Средна глава на делта',
      },
      {
        exercisedb_id: 'TFA88iB',
        name_bg: 'Предни махове',
        name_en: 'front raise',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        notes: 'Предна глава',
      },
      {
        exercisedb_id: 'G61cXLk',
        name_bg: 'Фейс пул',
        name_en: 'face pull',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Задни рамене',
      },
      {
        exercisedb_id: 'q2ADGqV',
        name_bg: 'Кабел коремни',
        name_en: 'cable crunch',
        sets: 4,
        reps: '20',
        rest_seconds: 45,
        notes: 'Тежък товар',
      },
      {
        exercisedb_id: 'tZkGYZ9',
        name_bg: 'Колело коремни',
        name_en: 'bicycle crunch',
        sets: 4,
        reps: '30',
        rest_seconds: 30,
        notes: 'Бързо темпо',
      },
      {
        exercisedb_id: 'I3tsCnC',
        name_bg: 'Повдигане на крака на лост',
        name_en: 'hanging leg raise',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Контролирано движение',
      },
    ],
  },

  // Friday - Arms (Biceps + Triceps)
  {
    day_of_week: 5,
    name: 'Ръце - Бицепс + Трицепс',
    duration: 60,
    exercises: [
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Барбел къръл',
        name_en: 'barbell curl',
        sets: 4,
        reps: '10',
        rest_seconds: 75,
        notes: 'Тежък товар',
      },
      {
        exercisedb_id: 'WcHl7ru',
        name_bg: 'Тесен хват бенч',
        name_en: 'close grip bench',
        sets: 4,
        reps: '10',
        rest_seconds: 75,
        notes: 'Масова работа за трицепс',
      },
      {
        exercisedb_id: 'qAmNMJY',
        name_bg: 'Дъмбел къръл',
        name_en: 'dumbbell curl',
        sets: 4,
        reps: '12',
        rest_seconds: 60,
        notes: 'Алтернирайте или заедно',
      },
      {
        exercisedb_id: 'qRZ5S1N',
        name_bg: 'Трицепс пушдаун',
        name_en: 'tricep pushdown',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Различни прикачвания',
      },
      {
        exercisedb_id: 'slDvUAU',
        name_bg: 'Чук къръл',
        name_en: 'hammer curl',
        sets: 4,
        reps: '12',
        rest_seconds: 60,
        notes: 'Forearm работа',
      },
      {
        exercisedb_id: '5uFK1xr',
        name_bg: 'Френска прес над глава',
        name_en: 'overhead extension',
        sets: 4,
        reps: '12',
        rest_seconds: 60,
        notes: 'Дълга глава',
      },
      {
        exercisedb_id: 'b6hQYMb',
        name_bg: 'Прийчър къръл',
        name_en: 'preacher curl',
        sets: 3,
        reps: '15',
        rest_seconds: 45,
        notes: 'Drop set на последната серия',
      },
      {
        exercisedb_id: 'dU605di',
        name_bg: 'Пушдаун с въже',
        name_en: 'rope pushdown',
        sets: 3,
        reps: '20',
        rest_seconds: 45,
        notes: 'Максимално стречинг',
      },
    ],
  },

  // Saturday - Full Body / Weak Points
  {
    day_of_week: 6,
    name: 'Цяло тяло / Слаби места',
    duration: 60,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове (умерен товар)',
        name_en: 'moderate squat',
        sets: 3,
        reps: '12',
        rest_seconds: 90,
        notes: 'Поддържаща работа',
      },
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Бенч прес (умерен)',
        name_en: 'moderate bench',
        sets: 3,
        reps: '12',
        rest_seconds: 90,
        notes: 'Поддържаща работа',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Лат пулдаун',
        name_en: 'lat pulldown',
        sets: 3,
        reps: '15',
        rest_seconds: 60,
        notes: 'Висок обем',
      },
      {
        exercisedb_id: 'goJ6ezq',
        name_bg: 'Странични махове',
        name_en: 'lateral raise',
        sets: 4,
        reps: '20',
        rest_seconds: 45,
        notes: 'Слабо място за повечето',
      },
      {
        exercisedb_id: 'G61cXLk',
        name_bg: 'Фейс пул',
        name_en: 'face pull',
        sets: 3,
        reps: '20',
        rest_seconds: 45,
        notes: 'Здраве на рамене',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк вариации',
        name_en: 'plank variations',
        sets: 3,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Core работа',
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
