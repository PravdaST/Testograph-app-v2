/**
 * Quiz Questions Data
 * 12 scientifically validated questions based on research
 * Categories: Physical (30%), Lifestyle (40%), Libido (30%)
 */

import type { QuizQuestion, QuizCategory } from '@/types'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ========== PHYSICAL QUESTIONS (30% weight) ==========

  {
    id: 1,
    type: 'slider',
    category: 'physical' as QuizCategory,
    weight: 3,
    question: 'Каква е вашата възраст?',
    min: 18,
    max: 70,
    step: 1,
    unit: 'години',
  },

  {
    id: 2,
    type: 'choice',
    category: 'physical' as QuizCategory,
    weight: 5,
    question: 'Как бихте описали нивото си на физическа активност?',
    options: [
      {
        value: 0,
        label: 'Не тренирам',
        description: 'Водя предимно заседнал начин на живот, без редовни тренировки.',
      },
      {
        value: 3,
        label: 'Леко активен',
        description: '1-2 тренировки седмично или лека физическа активност (напр. разходки).',
      },
      {
        value: 7,
        label: 'Умерено активен',
        description: '3-4 тренировки седмично.',
      },
      {
        value: 10,
        label: 'Много активен',
        description: '5 или повече интензивни тренировки седмично.',
      },
    ],
  },

  {
    id: 3,
    type: 'choice',
    category: 'physical' as QuizCategory,
    weight: 5,
    question: 'Наблюдавате ли някои от следните симптоми?',
    options: [
      {
        value: 10,
        label: 'Нямам симптоми',
        description: 'Чувствам се в отлична физическа форма.',
      },
      {
        value: 7,
        label: 'Леко намалена сила',
        description: 'Забелязвам лек спад в силата си.',
      },
      {
        value: 3,
        label: 'Загуба на мускулна маса',
        description: 'Забелязвам видима загуба на мускулна маса.',
      },
      {
        value: 0,
        label: 'Множество симптоми',
        description: 'Изпитвам комбинация от слабост, умора и загуба на мускулна маса.',
      },
    ],
  },

  {
    id: 4,
    type: 'choice',
    category: 'physical' as QuizCategory,
    weight: 4,
    question: 'Как бихте описали текущото си телосложение?',
    options: [
      {
        value: 10,
        label: 'Атлетично',
        description: 'Ясно изразена мускулатура и нисък процент подкожни мазнини.',
      },
      {
        value: 7,
        label: 'Нормално',
        description: 'В границите на здравословното тегло, с умерено развита мускулатура.',
      },
      {
        value: 3,
        label: 'Леко наднормено',
        description: 'Имам малко излишно тегло, концентрирано предимно в коремната област.',
      },
      {
        value: 0,
        label: 'Значително наднормено',
        description: 'Имам значително наднормено тегло.',
      },
    ],
  },

  // ========== LIFESTYLE QUESTIONS (40% weight) ==========

  {
    id: 5,
    type: 'slider',
    category: 'lifestyle' as QuizCategory,
    weight: 5,
    question: 'Колко часа сън имате средно на нощ?',
    min: 3,
    max: 11,
    step: 0.5,
    unit: 'часа',
  },

  {
    id: 6,
    type: 'choice',
    category: 'lifestyle' as QuizCategory,
    weight: 6,
    question: 'Как оценявате качеството на съня си?',
    options: [
      {
        value: 10,
        label: 'Отличен сън',
        description: 'Заспивам бързо и се събуждам отпочинал и зареден с енергия.',
      },
      {
        value: 7,
        label: 'Добър сън',
        description: 'Като цяло спя добре, но понякога имам леки затруднения.',
      },
      {
        value: 3,
        label: 'Лош сън',
        description: 'Често се будя през нощта и/или ми е трудно да заспя.',
      },
      {
        value: 0,
        label: 'Много лош сън',
        description: 'Страдам от хронично безсъние и почти винаги се чувствам уморен.',
      },
    ],
  },

  {
    id: 7,
    type: 'choice',
    category: 'lifestyle' as QuizCategory,
    weight: 6,
    question: 'Как оценявате нивата си на стрес?',
    options: [
      {
        value: 10,
        label: 'Минимален стрес',
        description: 'Водя спокоен и балансиран начин на живот.',
      },
      {
        value: 7,
        label: 'Умерен стрес',
        description: 'Изпитвам обичайните за ежедневието нива на напрежение.',
      },
      {
        value: 3,
        label: 'Висок стрес',
        description: 'Често се чувствам претоварен и под напрежение.',
      },
      {
        value: 0,
        label: 'Хроничен стрес',
        description: 'Изпитвам постоянно напрежение и безпокойство.',
      },
    ],
  },

  {
    id: 8,
    type: 'choice',
    category: 'lifestyle' as QuizCategory,
    weight: 5,
    question: 'Как бихте описали храненето си?',
    options: [
      {
        value: 10,
        label: 'Отлично хранене',
        description: 'Храня се балансирано, с диета, богата на протеини и полезни мазнини.',
      },
      {
        value: 7,
        label: 'Добро хранене',
        description: 'Като цяло се храня здравословно, но понякога консумирам и нездравословни храни.',
      },
      {
        value: 3,
        label: 'Лошо хранене',
        description: 'Често консумирам бързи храни и рядко ям плодове и зеленчуци.',
      },
      {
        value: 0,
        label: 'Много лошо хранене',
        description: 'Диетата ми се състои предимно от преработени храни с високо съдържание на захар.',
      },
    ],
  },

  {
    id: 9,
    type: 'choice',
    category: 'lifestyle' as QuizCategory,
    weight: 4,
    question: 'Каква е седмичната Ви консумация на алкохол?',
    options: [
      {
        value: 10,
        label: 'Не пия',
        description: 'Рядко или никога.',
      },
      {
        value: 7,
        label: '1-2 питиета',
        description: 'Пия в умерени количества.',
      },
      {
        value: 3,
        label: '3-5 питиета',
        description: 'Консумирам алкохол редовно.',
      },
      {
        value: 0,
        label: '6+ питиета',
        description: 'Консумирам алкохол често.',
      },
    ],
  },

  {
    id: 10,
    type: 'yesno',
    category: 'lifestyle' as QuizCategory,
    weight: 4,
    question: 'Правите ли силови тренировки редовно?',
    options: [
      {
        value: 10,
        label: 'Да',
        description: 'Да, поне 2-3 пъти седмично.',
      },
      {
        value: 0,
        label: 'Не',
        description: 'Не, рядко или никога.',
      },
    ],
  },

  // ========== LIBIDO QUESTIONS (30% weight) ==========

  {
    id: 11,
    type: 'choice',
    category: 'libido' as QuizCategory,
    weight: 6,
    question: 'Как оценявате Вашето либидо (сексуално желание)?',
    options: [
      {
        value: 10,
        label: 'Много високо',
        description: 'Имам силно и постоянно сексуално желание.',
      },
      {
        value: 7,
        label: 'Нормално',
        description: 'Имам здравословно и нормално ниво на интерес.',
      },
      {
        value: 3,
        label: 'Ниско',
        description: 'Чувствам намалено желание и интерес към секс.',
      },
      {
        value: 0,
        label: 'Много ниско',
        description: 'Нямам почти никакво сексуално желание.',
      },
    ],
  },

  {
    id: 12,
    type: 'choice',
    category: 'libido' as QuizCategory,
    weight: 5,
    question: 'Забелязвате ли промяна в сутрешните ерекции?',
    options: [
      {
        value: 10,
        label: 'Няма промяна',
        description: 'Имам редовни и силни сутрешни ерекции.',
      },
      {
        value: 7,
        label: 'Леко намаление',
        description: 'По-редки са, но все още се случват.',
      },
      {
        value: 3,
        label: 'Значително намаление',
        description: 'Рядко се случват или напълно липсват.',
      },
      {
        value: 0,
        label: 'Напълно липсват',
        description: 'Напълно отсъстват.',
      },
    ],
  },

  // ========== PREFERENCE QUESTIONS (не влияят на скора) ==========

  {
    id: 13,
    type: 'choice',
    category: 'lifestyle' as QuizCategory,
    weight: 0, // Не влияе на скора - само предпочитание
    question: 'Къде предпочитате да тренирате?',
    options: [
      {
        value: 0,
        label: 'Вкъщи',
        description: 'Предпочитам домашни тренировки с минимално оборудване.',
        metadata: { workout_location: 'home' },
      },
      {
        value: 0,
        label: 'Фитнес зала',
        description: 'Имам достъп до фитнес зала и предпочитам да тренирам там.',
        metadata: { workout_location: 'gym' },
      },
    ],
  },
]

// ========== SCORING CONFIGURATION ==========

export const QUIZ_CONFIG = {
  weights: {
    physical: 0.30, // 30%
    lifestyle: 0.40, // 40%
    libido: 0.30, // 30%
  },
  thresholds: {
    low: { min: 0, max: 40 },
    medium: { min: 41, max: 70 },
    high: { min: 71, max: 100 },
  },
}

// Calculate max possible points per category
export const MAX_POINTS = {
  physical: QUIZ_QUESTIONS.filter((q) => q.category === 'physical').reduce(
    (sum, q) => sum + q.weight * 10,
    0
  ),
  lifestyle: QUIZ_QUESTIONS.filter((q) => q.category === 'lifestyle').reduce(
    (sum, q) => sum + q.weight * 10,
    0
  ),
  libido: QUIZ_QUESTIONS.filter((q) => q.category === 'libido').reduce(
    (sum, q) => sum + q.weight * 10,
    0
  ),
}
