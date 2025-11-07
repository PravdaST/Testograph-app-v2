/**
 * MUSCLE Program Workouts - HOME VERSION
 * Focus: Progressive bodyweight training, tempo variations, hypertrophy
 * 5-6 days/week, no equipment needed (optional: resistance bands, chairs)
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

export const MUSCLE_NORMAL_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Гърди + Трицепс
  {
    day_of_week: 1,
    name: 'Гърди + Трицепс (Bodyweight)',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 5,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Темпо 3-0-1: бавно надолу за повече мускулно напрежение.',
      },
      {
        exercisedb_id: 'i5cEhka',
        name_bg: 'Лицеви опори с крака нагоре',
        name_en: 'decline push-up',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Поставете краката на стол или легло.',
      },
      {
        exercisedb_id: 'soIB2rj',
        name_bg: 'Диамантени лицеви опори',
        name_en: 'diamond push-up',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Фокус върху трицепса.',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Широки лицеви опори',
        name_en: 'wide push-up',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Широк захват за гръден кош.',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Паралелки на стол',
        name_en: 'chair dips',
        sets: 4,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Използвайте два стола за пълна амплитуда.',
      },
      {
        exercisedb_id: 'U3ffHlY',
        name_bg: 'Разгъване за трицепс на пода',
        name_en: 'bodyweight tricep extension',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Лежащ на гръб, ръце над главата, изправяне на ръцете.',
      },
    ],
  },

  // Tuesday - Гръб + Бицепс
  {
    day_of_week: 2,
    name: 'Гръб + Бицепс (Bodyweight)',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'bZGHsAZ',
        name_bg: 'Австралийски лост (маса)',
        name_en: 'inverted row',
        sets: 5,
        reps: '12-15',
        rest_seconds: 75,
        notes: 'Лягайте под масата, дръжте се за ръба.',
      },
      {
        exercisedb_id: '4GqRrAk',
        name_bg: 'Superman издърпвания',
        name_en: 'superman pull',
        sets: 4,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Легнете по корем, издърпайте лактите назад.',
      },
      {
        exercisedb_id: 'XUUD0Fs',
        name_bg: 'Обратен снежен ангел',
        name_en: 'reverse snow angel',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Легнете по корем, вдигнете ръцете и движете като ангел.',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Къдрене на врата',
        name_en: 'doorway curl',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Хванете се за каса на врата и правете къдрене.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Стабилизация на гърба.',
      },
    ],
  },

  // Wednesday - Крака
  {
    day_of_week: 3,
    name: 'Крака (Bodyweight)',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 5,
        reps: '20-30',
        rest_seconds: 75,
        notes: 'Високо повторение за мускулна издръжливост.',
      },
      {
        exercisedb_id: '5bpPTHv',
        name_bg: 'Клекове на един крак',
        name_en: 'pistol squat',
        sets: 4,
        reps: '8-12 на крак',
        rest_seconds: 90,
        notes: 'Напреднало упражнение за сила.',
      },
      {
        exercisedb_id: '5bpPTHv',
        name_bg: 'Български сплит клекове',
        name_en: 'bulgarian split squat',
        sets: 4,
        reps: '12-15 на крак',
        rest_seconds: 60,
        notes: 'Задният крак на повдигната повърхност (стол).',
      },
      {
        exercisedb_id: 'rmEukuS',
        name_bg: 'Глутеус мост на един крак',
        name_en: 'single leg glute bridge',
        sets: 4,
        reps: '15-20 на крак',
        rest_seconds: 60,
        notes: 'Фокус върху седалище и задна част.',
      },
      {
        exercisedb_id: 'IZVHb27',
        name_bg: 'Ходещи напади',
        name_en: 'walking lunge',
        sets: 4,
        reps: '15-20 на крак',
        rest_seconds: 60,
        notes: 'Дълги серии за пумп.',
      },
      {
        exercisedb_id: '2ORFMoR',
        name_bg: 'Изправяне на прасци (на един крак)',
        name_en: 'single leg calf raise',
        sets: 4,
        reps: '20-25 на крак',
        rest_seconds: 45,
        notes: 'Използвайте стъпало за пълна амплитуда.',
      },
    ],
  },

  // Thursday - Рамене + Кор
  {
    day_of_week: 4,
    name: 'Рамене + Кор (Bodyweight)',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Pike лицеви опори',
        name_en: 'pike push-up',
        sets: 5,
        reps: '12-15',
        rest_seconds: 75,
        notes: 'Основно упражнение за рамене без тегла.',
      },
      {
        exercisedb_id: 'XooAdhl',
        name_bg: 'Handstand hold (на стена)',
        name_en: 'wall handstand hold',
        sets: 4,
        reps: '20-30s',
        rest_seconds: 90,
        notes: 'Изометрично за рамене и сила.',
      },
      {
        exercisedb_id: 'KhHJ338',
        name_bg: 'Странично ходене в планк',
        name_en: 'lateral plank walk',
        sets: 3,
        reps: '10-12 на страна',
        rest_seconds: 60,
        notes: 'Развива странни дялове на рамената.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 4,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Основна стабилност.',
      },
      {
        exercisedb_id: 'KhHJ338',
        name_bg: 'Странен планк',
        name_en: 'side plank',
        sets: 3,
        reps: '45s на страна',
        rest_seconds: 45,
        notes: 'Коси коремни мускули.',
      },
      {
        exercisedb_id: 'tZkGYZ9',
        name_bg: 'Колело скручвания',
        name_en: 'bicycle crunch',
        sets: 3,
        reps: '20-30',
        rest_seconds: 45,
        notes: 'Динамично коремно упражнение.',
      },
    ],
  },

  // Friday - Гърди + Гръб (Pump Day)
  {
    day_of_week: 5,
    name: 'Гърди + Гръб Пумп',
    duration: 50,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 4,
        reps: '20-25',
        rest_seconds: 45,
        notes: 'Високо повторение за пумп.',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Широки лицеви опори',
        name_en: 'wide push-up',
        sets: 3,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Фокус върху гръден кош.',
      },
      {
        exercisedb_id: 'bZGHsAZ',
        name_bg: 'Австралийски лост',
        name_en: 'inverted row',
        sets: 4,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Високо повторение.',
      },
      {
        exercisedb_id: '4GqRrAk',
        name_bg: 'Superman издърпвания',
        name_en: 'superman pull',
        sets: 3,
        reps: '20-25',
        rest_seconds: 45,
        notes: 'До пълно изчерпване.',
      },
      {
        exercisedb_id: 'uTBt1HV',
        name_bg: 'Скапуларни лицеви опори',
        name_en: 'scapular push-up',
        sets: 3,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Активира серат и стабилизатори.',
      },
    ],
  },

  // Saturday - Ръце + Кор
  {
    day_of_week: 6,
    name: 'Ръце + Кор',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'soIB2rj',
        name_bg: 'Диамантени лицеви опори',
        name_en: 'diamond push-up',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Фокус върху трицепс.',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Паралелки на стол',
        name_en: 'chair dips',
        sets: 4,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Пълна амплитуда.',
      },
      {
        exercisedb_id: 'T2mxWqc',
        name_bg: 'Негативи на лост (бицепс)',
        name_en: 'chin-up negative',
        sets: 4,
        reps: '5-8',
        rest_seconds: 75,
        notes: 'Ако имаш лост, правете негативи (скачаш горе, бавно надолу).',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Стабилизация.',
      },
      {
        exercisedb_id: 'Hgs6Nl1',
        name_bg: 'Вдигане на крака',
        name_en: 'leg raise',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Долна част на корема.',
      },
    ],
  },

  // Sunday - Активна почивка
  {
    day_of_week: 7,
    name: 'Активна почивка / Разтягане',
    duration: 20,
    exercises: [
      {
        exercisedb_id: 'bWlZvXh',
        name_bg: 'Йога / Разтягане',
        name_en: 'yoga flow',
        sets: 1,
        reps: '20мин',
        rest_seconds: 0,
        notes: 'Фокус върху мобилност и възстановяване.',
      },
    ],
  },
]

