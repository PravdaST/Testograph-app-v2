/**
 * Quiz Types - Category-based quiz system
 */

export type QuizCategory = 'libido' | 'energy' | 'muscle'

export type QuizSection = 'demographics' | 'symptoms' | 'nutrition' | 'training' | 'sleep_recovery'

export type QuestionType =
  | 'scale'
  | 'single_choice'
  | 'bmi_input'
  | 'transition_message'  // For engagement/education between questions
  | 'text_input'          // For name, profession, etc.

export interface QuizMetadata {
  category: QuizCategory
  category_name: string
  version: string
  total_questions: number
  max_score: number
  estimated_time_minutes: number
  language: string
}

export interface QuestionOption {
  id: string
  text: string
  points: number
  age?: number // For demographics questions
  description?: string
  note?: string
}

export interface ScaleConfig {
  min: number
  max: number
  min_label: string
  max_label: string
  points_multiplier: number
}

export interface DynamicCopyVariant {
  condition: string  // e.g., "unhealthy_habits", "average_habits", "healthy_habits"
  text: string
  variables?: Record<string, string>
}

export interface AIImagePrompt {
  prompt: string
  style: 'clinical' | 'infographic' | 'testimonial' | 'realistic' | 'progress'
  size?: string  // e.g., "800x400px"
}

export interface LottieAnimation {
  type: 'lottie'
  src: string
  loop?: boolean
  autoplay?: boolean
  style?: React.CSSProperties
}

export interface ChartAnimation {
  type: 'chart'
  chartType: 'line'
  data: {
    xAxis: string[]
    yAxis: number[]
    color: string
    gradient?: boolean
  }
  animationDuration?: number
}

export interface CountUpAnimation {
  type: 'countup'
  targetNumber: number
  prefix?: string
  suffix?: string
  duration?: number
  style?: React.CSSProperties
  avatarAnimation?: LottieAnimation
}

export type AnimationConfig = LottieAnimation | ChartAnimation | CountUpAnimation

export interface QuizQuestion {
  id: string
  number: number
  section: QuizSection
  question: string
  description: string
  type: QuestionType
  required: boolean
  options?: QuestionOption[]
  scale?: ScaleConfig
  // New fields for 25-step funnel
  dynamic_copy?: DynamicCopyVariant[]  // For conditional text based on previous answers
  ai_image_prompt?: AIImagePrompt      // For AI-generated visualizations
  placeholder?: string                  // For text_input type
  animation?: AnimationConfig           // For animated transition screens
}

export interface CategoryQuiz {
  quiz_metadata: QuizMetadata
  questions: QuizQuestion[]
}

export interface QuizResponse {
  question_id: string
  answer: string | number
  points: number
}

export interface QuizBreakdown {
  symptoms: number // 0-10
  nutrition: number // 0-10
  training: number // 0-10
  sleep_recovery: number // 0-10
  context: number // 0-10 (commitment, vision, trust questions)
  overall: number // 0-100
}

export interface QuizResult {
  category: QuizCategory
  total_score: number // 0-100
  determined_level: 'low' | 'normal' | 'high'
  breakdown: QuizBreakdown
  responses: QuizResponse[]
  completed_at: string
}

// Category metadata for UI
export interface CategoryInfo {
  id: QuizCategory
  name: string
  emoji: string
  description: string
  focusAreas: string[]
  color: string
}
