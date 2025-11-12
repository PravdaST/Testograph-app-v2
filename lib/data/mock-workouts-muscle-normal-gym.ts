/**
 * MUSCLE Program Workouts
 * Focus: Hypertrophy, muscle building, high volume training
 * 5-6 days/week with body part split for maximum growth
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

export const MUSCLE_NORMAL_GYM_WORKOUTS: WorkoutProgram[] = [
  // Monday - Гърди + Трицепс
  {
    day_of_week: 1,
    name: 'Гърди + Трицепс',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'W9pFVv1',
        name_bg: 'Вдигане от лег с щанга',
        name_en: 'barbell bench press',
        sets: 4,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Основно упражнение за гръден кош. Фокус върху техника.',
      },
      {
        exercisedb_id: 'yaMIo4D',
        name_bg: 'Вдигане от полулег с дъмбели',
        name_en: 'incline dumbbell press',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Развива горна част на гърдите.',
      },
      {
        exercisedb_id: 'K5TldTr',
        name_bg: 'Флайс с дъмбели',
        name_en: 'dumbbell fly',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Изолация на гръдния кош. Контролирано движение.',
      },
      {
        exercisedb_id: 'j7XMAyn',
        name_bg: 'Кросоувър на скрипец',
        name_en: 'cable crossover',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Завършващо упражнение за пълна контракция.',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Кофички на паралелка',
        name_en: 'tricep dips',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Основно упражнение за трицепс. Наклон напред за гърди.',
      },
      {
        exercisedb_id: 'dU605di',
        name_bg: 'Трицепсово разгъване на горен скрипец с въже',
        name_en: 'rope pushdown',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Изолация на трицепс. Завършваща серия.',
      },
    ],
  },

  // Tuesday - Гръб + Бицепс
  {
    day_of_week: 2,
    name: 'Гръб + Бицепс',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'ila4NZS',
        name_bg: 'Мъртва тяга',
        name_en: 'barbell deadlift',
        sets: 4,
        reps: '6-8',
        rest_seconds: 120,
        notes: 'Базово упражнение за цялата задна верига.',
      },
      {
        exercisedb_id: 'Qqi7bko',
        name_bg: 'Набирания с широк хват',
        name_en: 'wide grip pull-up',
        sets: 4,
        reps: '8-12',
        rest_seconds: 90,
        notes: 'Развива широчина на гърба. Използвай помощна машина ако е нужно.',
      },
      {
        exercisedb_id: 'BJ0Hz5L',
        name_bg: 'Гребане с дъмбели',
        name_en: 'dumbbell bent over row',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Изгражда дебелина на гърба.',
      },
      {
        exercisedb_id: 'fUBheHs',
        name_bg: 'Гребане на долен скрипец',
        name_en: 'seated cable row',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Фокус върху средна част на гърба.',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Бицепсово сгъване с щанга',
        name_en: 'barbell curl',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Класическо упражнение за бицепс.',
      },
      {
        exercisedb_id: 'W74bXnw',
        name_bg: 'Бицепсово сгъване с дъмбели от полулег',
        name_en: 'incline dumbbell curl',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Пълно разтягане на бицепса.',
      },
      {
        exercisedb_id: 'slDvUAU',
        name_bg: 'Чуково сгъване с дъмбели',
        name_en: 'hammer curl',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива брахиалис и дебелина на ръката.',
      },
    ],
  },

  // Wednesday - Крака
  {
    day_of_week: 3,
    name: 'Крака',
    duration: 65,
    exercises: [
      {
        exercisedb_id: '1gFNTZV',
        name_bg: 'Клекове с щанга',
        name_en: 'barbell squat',
        sets: 5,
        reps: '8-10',
        rest_seconds: 120,
        notes: 'Крал на упражненията за крака. Тежки тегла.',
      },
      {
        exercisedb_id: 'wQ2c4XD',
        name_bg: 'Румънска мъртва тяга',
        name_en: 'romanian deadlift',
        sets: 4,
        reps: '10-12',
        rest_seconds: 90,
        notes: 'Развива задна част на бедрата.',
      },
      {
        exercisedb_id: '7zdxRTl',
        name_bg: 'Преса за крака',
        name_en: 'leg press',
        sets: 4,
        reps: '12-15',
        rest_seconds: 75,
        notes: 'Високо натоварване без стрес за гърба.',
      },
      {
        exercisedb_id: 'RRWFUcw',
        name_bg: 'Напади с дъмбели',
        name_en: 'dumbbell lunge',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива баланс и симетрия.',
      },
      {
        exercisedb_id: 'my33uHU',
        name_bg: 'Разтягане за квадрицепс',
        name_en: 'leg extension',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Изолация на квадрицепса.',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Къдрене за задна част',
        name_en: 'leg curl',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Изолация на задна част на бедрата.',
      },
      {
        exercisedb_id: '2ORFMoR',
        name_bg: 'Изправяне на прасци',
        name_en: 'calf raise',
        sets: 4,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Развива прасците. Пълна амплитуда.',
      },
    ],
  },

  // Thursday - Рамене + Кор
  {
    day_of_week: 4,
    name: 'Рамене + Корем',
    duration: 55,
    exercises: [
      {
        exercisedb_id: 'znQUdHY',
        name_bg: 'Раменни преси с дъмбели',
        name_en: 'dumbbell shoulder press',
        sets: 4,
        reps: '10-12',
        rest_seconds: 75,
        notes: 'Основно упражнение за рамене.',
      },
      {
        exercisedb_id: 'goJ6ezq',
        name_bg: 'Странични вдигания',
        name_en: 'lateral raise',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Изолация на средна част на рамото.',
      },
      {
        exercisedb_id: 'TFA88iB',
        name_bg: 'Предни вдигания',
        name_en: 'front raise',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива предна част на рамото.',
      },
      {
        exercisedb_id: 'XUUD0Fs',
        name_bg: 'Разперки за задни рамене',
        name_en: 'rear delt fly',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Балансира раменната мускулатура.',
      },
      {
        exercisedb_id: 'trmte8s',
        name_bg: 'Свиване на рамене',
        name_en: 'shrugs',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Развива трапеца.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Стабилизация на корема.',
      },
      {
        exercisedb_id: 'I3tsCnC',
        name_bg: 'Вдигане на крака на лост',
        name_en: 'hanging leg raise',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива долна част на корема.',
      },
      {
        exercisedb_id: 'XVDdcoj',
        name_bg: 'Руски завъртания',
        name_en: 'russian twist',
        sets: 3,
        reps: '20-30',
        rest_seconds: 45,
        notes: 'Развива коси коремни мускули.',
      },
    ],
  },

  // Friday - Гърди + Гръб (Pump Day)
  {
    day_of_week: 5,
    name: 'Гърди + Гръб (Пумп ден)',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 4,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Високо повторение за пумп. Вариации за интензивност.',
      },
      {
        exercisedb_id: 'yaMIo4D',
        name_bg: 'Наклонена лежанка',
        name_en: 'incline press',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'По-леки тегла, фокус върху контракция.',
      },
      {
        exercisedb_id: 'FVmZVhk',
        name_bg: 'Пек-дек машина',
        name_en: 'pec deck',
        sets: 3,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Максимален пумп на гърдите.',
      },
      {
        exercisedb_id: '4IKbhHV',
        name_bg: 'Издърпване на лат машина',
        name_en: 'lat pulldown',
        sets: 4,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива широчина на гърба.',
      },
      {
        exercisedb_id: 'fUBheHs',
        name_bg: 'Гребане на кабел',
        name_en: 'cable row',
        sets: 3,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Високо повторение за пълно изчерпване.',
      },
      {
        exercisedb_id: 'G61cXLk',
        name_bg: 'Лицеви издърпвания',
        name_en: 'face pulls',
        sets: 3,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Корекция на осанката и здрави рамене.',
      },
    ],
  },

  // Saturday - Ръце + Кор
  {
    day_of_week: 6,
    name: 'Ръце + Корем',
    duration: 50,
    exercises: [
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Къдрене със щанга',
        name_en: 'barbell curl',
        sets: 4,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Класическо упражнение за бицепс.',
      },
      {
        exercisedb_id: 'dU605di',
        name_bg: 'Разтегляния на въже',
        name_en: 'rope pushdown',
        sets: 4,
        reps: '10-12',
        rest_seconds: 60,
        notes: 'Изолация на трицепс.',
      },
      {
        exercisedb_id: 'W74bXnw',
        name_bg: 'Къдрене с дъмбели',
        name_en: 'dumbbell curl',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Алтернативно къдрене.',
      },
      {
        exercisedb_id: '5uFK1xr',
        name_bg: 'Разгъване над главата',
        name_en: 'overhead extension',
        sets: 3,
        reps: '12-15',
        rest_seconds: 60,
        notes: 'Развива дълга глава на трицепса.',
      },
      {
        exercisedb_id: 'slDvUAU',
        name_bg: 'Чук къдрене',
        name_en: 'hammer curl',
        sets: 3,
        reps: '15-20',
        rest_seconds: 45,
        notes: 'Финализира ръцете.',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '60s',
        rest_seconds: 60,
        notes: 'Основна стабилност.',
      },
      {
        exercisedb_id: 'q2ADGqV',
        name_bg: 'Ролка за корем',
        name_en: 'ab wheel rollout',
        sets: 3,
        reps: '10-15',
        rest_seconds: 60,
        notes: 'Напреднало упражнение за корем.',
      },
    ],
  },

  // Sunday - Пълна почивка или активно възстановяване
  {
    day_of_week: 7,
    name: 'Почивка / Активно възстановяване',
    duration: 0,
    exercises: [],
  },
]

