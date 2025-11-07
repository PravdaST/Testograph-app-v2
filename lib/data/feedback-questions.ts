/**
 * Feedback Questions System
 * Questions asked on days 7, 14, 21, 28, and 30
 */

export type FeedbackDay = 7 | 14 | 21 | 28 | 30

export interface FeedbackQuestion {
  id: string
  type: 'scale' | 'yesno' | 'text' | 'percentage'
  question: string
  required: boolean
  min?: number
  max?: number
  options?: { value: string; label: string }[]
}

export interface FeedbackResponse {
  question_id: string
  answer: string | number
}

// Questions for days 7, 14, 21, 28
const PROGRESS_QUESTIONS: FeedbackQuestion[] = [
  {
    id: 'overall_feeling',
    type: 'scale',
    question: 'Как се чувствате като цяло?',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'energy_level',
    type: 'scale',
    question: 'Как оценявате енергията си през деня?',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'sleep_quality',
    type: 'scale',
    question: 'Как оценявате качеството на съня си?',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'libido_level',
    type: 'scale',
    question: 'Как оценявате Вашето либидо и сексуално желание?',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'physical_changes',
    type: 'yesno',
    question: 'Забелязвате ли физически промени?',
    required: true,
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'somewhat', label: 'Донякъде' },
      { value: 'no', label: 'Не' },
    ],
  },
  {
    id: 'program_adherence',
    type: 'percentage',
    question: 'Колко процента от програмата спазвате?',
    required: true,
    min: 0,
    max: 100,
  },
  {
    id: 'challenges',
    type: 'text',
    question: 'С какви предизвикателства се сблъсквате?',
    required: false,
  },
  {
    id: 'notes',
    type: 'text',
    question: 'Допълнителни коментари',
    required: false,
  },
]

// Additional questions for day 30 (final evaluation)
const FINAL_QUESTIONS: FeedbackQuestion[] = [
  {
    id: 'goal_achieved',
    type: 'yesno',
    question: 'Постигнахте ли очакваните резултати?',
    required: true,
    options: [
      { value: 'yes', label: 'Да, напълно' },
      { value: 'partially', label: 'Частично' },
      { value: 'no', label: 'Не' },
    ],
  },
  {
    id: 'biggest_change',
    type: 'text',
    question: 'Коя е най-голямата промяна, която забелязахте?',
    required: true,
  },
  {
    id: 'what_helped_most',
    type: 'text',
    question: 'Какво Ви помогна най-много?',
    required: false,
  },
  {
    id: 'what_to_improve',
    type: 'text',
    question: 'Какво бихте променили в програмата?',
    required: false,
  },
  {
    id: 'would_recommend',
    type: 'scale',
    question: 'Колко вероятно е да препоръчате програмата? (1-10)',
    required: true,
    min: 1,
    max: 10,
  },
]

export function getFeedbackQuestions(day: FeedbackDay): FeedbackQuestion[] {
  if (day === 30) {
    return [...PROGRESS_QUESTIONS, ...FINAL_QUESTIONS]
  }
  return PROGRESS_QUESTIONS
}

export function getFeedbackTitle(day: FeedbackDay): string {
  if (day === 30) {
    return 'Финална оценка - Ден 30'
  }
  return `Проверка на прогреса - Ден ${day}`
}

export function getFeedbackDescription(day: FeedbackDay): string {
  if (day === 30) {
    return 'Поздравления! Завършихте 30-дневната програма. Моля, споделете своя опит и резултати.'
  }
  return `Как върви програмата до момента? Моля, отделете 2 минути, за да споделите своя напредък.`
}
