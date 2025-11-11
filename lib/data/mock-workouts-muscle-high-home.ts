/**
 * MUSCLE Program Workouts - HIGH Level - HOME VERSION
 * For users with HIGH muscle score (71-100 points)
 * Focus: Advanced bodyweight hypertrophy, high volume, tempo manipulation
 * Frequency: 6 days/week (Push/Pull/Legs × 2)
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

export const MUSCLE_HIGH_HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Push (Chest + Shoulders + Triceps)
  {
    day_of_week: 1,
    name: 'Push - Гърди, Рамене, Трицепс',
    duration: 65,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори (archer)',
        name_en: 'archer push-up',
        sets: 5,
        reps: '10/страна',
        rest_seconds: 90,
        notes: 'Темпо 3-1-1, една ръка доминира',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Диамантени опори',
        name_en: 'diamond push-up',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Фокус върху трицепс',
      },
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Пайк опори (стръмни)',
        name_en: 'steep pike push-up',
        sets: 5,
        reps: '15',
        rest_seconds: 75,
        notes: 'Крака на повдигната повърхност',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори с темп',
        name_en: 'tempo push-up',
        sets: 4,
        reps: '12',
        rest_seconds: 60,
        notes: 'Темпо 4-2-1',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Дипс (напреднал)',
        name_en: 'advanced dips',
        sets: 5,
        reps: '20',
        rest_seconds: 60,
        notes: 'Краката повдигнати',
      },
      {
        exercisedb_id: 'AQ0mC4Y',
        name_bg: 'Странични махове (бутилки)',
        name_en: 'bottle lateral raise',
        sets: 4,
        reps: '20',
        rest_seconds: 45,
        notes: 'Максимално натоварени бутилки',
      },
    ],
  },

  // Tuesday - Pull (Back + Biceps)
  {
    day_of_week: 2,
    name: 'Pull - Гръб, Бицепс',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Австралийски лост (тежък)',
        name_en: 'weighted inverted row',
        sets: 5,
        reps: '15',
        rest_seconds: 90,
        notes: 'Раница с тежести, темпо 3-1-1',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Лост (ако е възможно)',
        name_en: 'pull-up',
        sets: 5,
        reps: 'До отказ',
        rest_seconds: 120,
        notes: 'Или негативи ако не може пълен',
      },
      {
        exercisedb_id: 'bKWbrTA',
        name_bg: 'Гребане с кърпа (едноръчно)',
        name_en: 'single arm towel row',
        sets: 5,
        reps: '15/ръка',
        rest_seconds: 60,
        notes: 'Максимално свиване',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Бицепс къръл с кърпа',
        name_en: 'towel bicep curl',
        sets: 5,
        reps: '15',
        rest_seconds: 60,
        notes: 'Изометрична работа',
      },
      {
        exercisedb_id: '4GqRrAk',
        name_bg: 'Супермен (темпо)',
        name_en: 'tempo superman',
        sets: 4,
        reps: '15',
        rest_seconds: 45,
        notes: 'Темпо 3-2-1, задържане горе',
      },
    ],
  },

  // Wednesday - Legs + Core
  {
    day_of_week: 3,
    name: 'Крака + Корем',
    duration: 70,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Пистол клекове',
        name_en: 'pistol squat',
        sets: 5,
        reps: '10/крак',
        rest_seconds: 120,
        notes: 'Пълна амплитуда, минимална помощ',
      },
      {
        exercisedb_id: '5bpPTHv',
        name_bg: 'Български сплит клекове',
        name_en: 'bulgarian split squat',
        sets: 5,
        reps: '15/крак',
        rest_seconds: 90,
        notes: 'Задният крак повдигнат',
      },
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове с темп (обем)',
        name_en: 'high volume tempo squat',
        sets: 5,
        reps: '25',
        rest_seconds: 90,
        notes: 'Темпо 3-0-1',
      },
      {
        exercisedb_id: 'aWedzZX',
        name_bg: 'Мост на един крак',
        name_en: 'single leg glute bridge',
        sets: 5,
        reps: '20/крак',
        rest_seconds: 60,
        notes: 'Задържане 3s горе',
      },
      {
        exercisedb_id: '17lJ1kr',
        name_bg: 'Нордик къръл (асистиран)',
        name_en: 'assisted nordic curl',
        sets: 4,
        reps: '8-10',
        rest_seconds: 90,
        notes: 'Задна част на бедрата',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк (напреднал)',
        name_en: 'advanced plank',
        sets: 4,
        reps: '90s',
        rest_seconds: 60,
        notes: 'Краката повдигнати или с тегло',
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
    ],
  },

  // Thursday - Push (Volume)
  {
    day_of_week: 4,
    name: 'Push - Обем',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Опори (стандартни високо повторение)',
        name_en: 'high rep push-up',
        sets: 5,
        reps: '25',
        rest_seconds: 60,
        notes: 'Темпо 2-0-1',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Наклонени опори (краката горе)',
        name_en: 'decline push-up',
        sets: 5,
        reps: '20',
        rest_seconds: 60,
        notes: 'Горна част на гърдите',
      },
      {
        exercisedb_id: 'sVvXT5J',
        name_bg: 'Пайк опори',
        name_en: 'pike push-up',
        sets: 4,
        reps: '18',
        rest_seconds: 60,
        notes: 'Рамене',
      },
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Широки опори',
        name_en: 'wide push-up',
        sets: 4,
        reps: '20',
        rest_seconds: 60,
        notes: 'Акцент върху гърдите',
      },
      {
        exercisedb_id: '7aVz15j',
        name_bg: 'Дипс до отказ',
        name_en: 'dips to failure',
        sets: 4,
        reps: 'До отказ',
        rest_seconds: 75,
        notes: 'Последната серия максимални повторения',
      },
    ],
  },

  // Friday - Pull (Volume)
  {
    day_of_week: 5,
    name: 'Pull - Обем',
    duration: 60,
    exercises: [
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Австралийски лост (обем)',
        name_en: 'high volume inverted row',
        sets: 5,
        reps: '20',
        rest_seconds: 75,
        notes: 'Темпо 2-1-1',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Лост / Негативи',
        name_en: 'pull-up negatives',
        sets: 5,
        reps: '8 или негативи 5×8s',
        rest_seconds: 120,
        notes: 'Максимален обем',
      },
      {
        exercisedb_id: 'bKWbrTA',
        name_bg: 'Гребане с кърпа (двуръчно)',
        name_en: 'double towel row',
        sets: 4,
        reps: '15',
        rest_seconds: 60,
        notes: 'Средна част на гръб',
      },
      {
        exercisedb_id: '25GPyDY',
        name_bg: 'Бицепс изометрични',
        name_en: 'isometric bicep hold',
        sets: 4,
        reps: '45s',
        rest_seconds: 60,
        notes: 'Различни ъгли',
      },
      {
        exercisedb_id: '4GqRrAk',
        name_bg: 'Супермен',
        name_en: 'superman',
        sets: 4,
        reps: '20',
        rest_seconds: 45,
        notes: 'Долна част на гръб',
      },
    ],
  },

  // Saturday - Legs + Core (Volume)
  {
    day_of_week: 6,
    name: 'Крака + Корем - Обем',
    duration: 65,
    exercises: [
      {
        exercisedb_id: 'TUZLh71',
        name_bg: 'Клекове (100 rep challenge)',
        name_en: 'squat 100 rep challenge',
        sets: 1,
        reps: '100',
        rest_seconds: 0,
        notes: 'Раздели на сетове ако е нужно, минимална почивка',
      },
      {
        exercisedb_id: 'lBDjFxJ',
        name_bg: 'Напади (ходещи)',
        name_en: 'walking lunge',
        sets: 5,
        reps: '20/крак',
        rest_seconds: 60,
        notes: 'Максимална амплитуда',
      },
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Скокови клекове',
        name_en: 'jump squat',
        sets: 4,
        reps: '20',
        rest_seconds: 60,
        notes: 'Експлозивност',
      },
      {
        exercisedb_id: 'GibBPPg',
        name_bg: 'Глутеус мост (обем)',
        name_en: 'high volume glute bridge',
        sets: 5,
        reps: '25',
        rest_seconds: 45,
        notes: 'Непрекъснато напрежение',
      },
      {
        exercisedb_id: 'VBAWRPG',
        name_bg: 'Планк комбо',
        name_en: 'plank combo',
        sets: 4,
        reps: '90s',
        rest_seconds: 60,
        notes: 'Различни вариации',
      },
      {
        exercisedb_id: 'tZkGYZ9',
        name_bg: 'Колело коремни',
        name_en: 'bicycle crunch',
        sets: 4,
        reps: '40',
        rest_seconds: 30,
        notes: 'Максимално темпо',
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
