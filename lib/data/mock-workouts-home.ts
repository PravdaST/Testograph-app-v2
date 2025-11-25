/**
 * HOME Workout Data - Bodyweight Only
 * No equipment needed - perfect for home training
 */

import { WorkoutProgram } from './mock-workouts'

export const HOME_WORKOUTS: WorkoutProgram[] = [
  // Monday - Кардио + Долна част (Bodyweight)
  {
    day_of_week: 1,
    name: 'Кардио + Долна част',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'LIlE5Tn',
        name_bg: 'Клекове',
        name_en: 'bodyweight squat',
        sets: 4,
        reps: '15-20',
        rest_seconds: 60,
        notes: 'Дръжте гърба изправен, а коленете да не излизат пред пръстите на краката.',
      },
      {
        exercisedb_id: 'IZVHb27',
        name_bg: 'Ходещи напади',
        name_en: 'walking lunge',
        sets: 3,
        reps: '12-15 на крак',
        rest_seconds: 60,
        notes: 'Редувайте краката и пазете равновесие.',
      },
      {
        exercisedb_id: 'rmEukuS',
        name_bg: 'Глутеус мост на един крак',
        name_en: 'single leg bridge with outstretched leg',
        sets: 3,
        reps: '12-15 на крак',
        rest_seconds: 60,
        notes: 'Стягайте седалищните мускули и задната част на бедрата.',
      },
      {
        exercisedb_id: '1ZFqTDN',
        name_bg: 'Джъмпинг Джакс',
        name_en: 'jack jump',
        sets: 3,
        reps: '30-45s',
        rest_seconds: 45,
        notes: 'Кардио за финал на тренировката.',
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

  // Wednesday - Горна част на тялото (Bodyweight)
  {
    day_of_week: 3,
    name: 'Горна част на тялото',
    duration: 40,
    exercises: [
      {
        exercisedb_id: 'I4hDWkc',
        name_bg: 'Лицеви опори',
        name_en: 'push-up',
        sets: 3,
        reps: '12-20',
        rest_seconds: 60,
        notes: 'Поддържайте тялото в права линия.',
      },
      {
        exercisedb_id: 'VPPtusI',
        name_bg: 'Обърнато гребане със сгънати колене',
        name_en: 'inverted row bent knees',
        sets: 3,
        reps: '10-15',
        rest_seconds: 60,
        notes: 'Използвайте стабилна маса или лост на подходяща височина.',
      },
      {
        exercisedb_id: 'i5cEhka',
        name_bg: 'Лицеви опори с наклон надолу',
        name_en: 'decline push-up',
        sets: 3,
        reps: '10-15',
        rest_seconds: 60,
        notes: 'Поставете краката на повдигната повърхност.',
      },
      {
        exercisedb_id: '0V2YQjW',
        name_bg: 'Набирания с неутрален хват',
        name_en: 'pull up (neutral grip)',
        sets: 3,
        reps: '5-10',
        rest_seconds: 90,
        notes: 'Използвайте лост за набирания или здрава рамка на врата, ако е възможно.',
      },
      {
        exercisedb_id: 'soIB2rj',
        name_bg: 'Диамантени лицеви опори',
        name_en: 'diamond push-up',
        sets: 3,
        reps: '10-15',
        rest_seconds: 60,
        notes: 'Ръцете трябва да образуват форма на диамант под гърдите.',
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

  // Friday - Пълно тяло (Bodyweight)
  {
    day_of_week: 5,
    name: 'Пълно тяло',
    duration: 45,
    exercises: [
      {
        exercisedb_id: 'dK9394r',
        name_bg: 'Бърпита',
        name_en: 'burpee',
        sets: 3,
        reps: '10-15',
        rest_seconds: 60,
        notes: 'Изпълнявайте движението експлозивно.',
      },
      {
        exercisedb_id: 'KhHJ338',
        name_bg: 'Планк',
        name_en: 'plank',
        sets: 3,
        reps: '45-90s',
        rest_seconds: 45,
        notes: 'Поддържайте тялото в права линия.',
      },
      {
        exercisedb_id: 'RJgzwny',
        name_bg: 'Планински катерач',
        name_en: 'mountain climber',
        sets: 3,
        reps: '30-40',
        rest_seconds: 45,
        notes: 'Поддържайте бързо темпо.',
      },
      {
        exercisedb_id: 'rmEukuS',
        name_bg: 'Глутеус мост на един крак',
        name_en: 'single leg bridge with outstretched leg',
        sets: 3,
        reps: '12-15 на крак',
        rest_seconds: 60,
        notes: 'Алтернатива на мъртвата тяга - фокусирайте се върху седалищните мускули.',
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
