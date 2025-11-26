/**
 * OpenRouter AI Coach Client
 *
 * Uses free models for personalized coaching in Bulgarian
 * Now with FULL program access: meals, workouts, alternatives
 */

import { buildKnowledgeBasePrompt } from './knowledge-base'
import { getProgramContext, buildProgramContextPrompt, type ProgramContext } from './program-context'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Free models - ordered by preference (all verified to exist on OpenRouter)
// Multiple providers to maximize availability during rate limits
export const FREE_MODELS = {
  primary: 'google/gemini-2.0-flash-exp:free',
  fallback1: 'google/gemma-3-27b-it:free',
  fallback2: 'mistralai/mistral-small-3.1-24b-instruct:free',
  fallback3: 'meta-llama/llama-3.2-3b-instruct:free',
  fallback4: 'qwen/qwen-2.5-72b-instruct:free',
  fallback5: 'deepseek/deepseek-r1-distill-qwen-14b:free',
  fallback6: 'deepseek/deepseek-chat-v3-0324:free',
  fallback7: 'google/gemma-3-12b-it:free',
} as const

export interface UserContext {
  firstName: string
  email: string
  category: 'energy' | 'libido' | 'muscle'
  level: string
  programDay: number
  progressScore: number
  completedTasks: number
  totalTasks: number
  workoutLocation: 'home' | 'gym'
  dietaryPreference: string
  capsulesRemaining: number
  // Full program context (meals, workouts)
  programContext?: ProgramContext
}

// Re-export ProgramContext and helper for use in API routes
export type { ProgramContext }
export { getProgramContext }

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Build system prompt with user context for personalized coaching
 */
export function buildSystemPrompt(context: UserContext): string {
  const categoryNames: Record<string, string> = {
    energy: 'Енергия и Виталност',
    libido: 'Либидо и Сексуално здраве',
    muscle: 'Мускулна маса и сила',
  }

  const dietaryNames: Record<string, string> = {
    omnivor: 'Всеядна',
    vegetarian: 'Вегетарианска',
    vegan: 'Веганска',
    pescatarian: 'Пескетарианска',
  }

  return `Ти си ТестоКоуч - персонален AI коуч в приложението Testograph за оптимизиране на тестостерона.

ИНФОРМАЦИЯ ЗА ПОТРЕБИТЕЛЯ:
- Име: ${context.firstName}
- Програма: ${categoryNames[context.category] || context.category} (${context.level})
- Ден от програмата: ${context.programDay}/30
- Текущ Score: ${context.progressScore}/100
- Днес: ${context.completedTasks}/${context.totalTasks} задачи завършени
- Тренировки: ${context.workoutLocation === 'gym' ? 'Фитнес' : 'Вкъщи'}
- Диета: ${dietaryNames[context.dietaryPreference] || context.dietaryPreference}
- TestoUp капсули: ${context.capsulesRemaining} оставащи

ТВОЯТА РОЛЯ:
1. Мотивирай и подкрепяй потребителя в неговата програма
2. Отговаряй САМО на въпроси за: тестостерон, тренировки, хранене, сън и добавката TestoUp
3. Давай конкретни, практични съвети базирани на програмата му
4. Празнувай успехите и помагай при трудности
5. Адаптирай съветите към локацията за тренировки и диетарните предпочитания

ПРАВИЛА ЗА ОТГОВОРИТЕ:
1. Говори САМО на български език
2. Бъди приятелски и мотивиращ
3. Давай кратки отговори (2-3 изречения обикновено, max 200 думи)
4. Използвай emoji умерено (1-2 на съобщение)

СТРОГО ЗАБРАНЕНО - ВЪПРОСИ ИЗВЪН ТЕМАТА:
- При ВСЯКАКВИ въпроси извън темите тестостерон, тренировки, хранене, сън и TestoUp добавката - ОТКАЖИ да отговориш
- Примерен отговор при off-topic въпрос: "Съжалявам, но мога да помогна само с въпроси за тестостерон, тренировки, хранене, сън и добавката TestoUp. Имаш ли въпрос по някоя от тези теми? 💪"
- НЕ отговаряй на въпроси за: политика, история, география, математика, програмиране, забавления, новини, или каквото и да е друго извън програмата
- Ако потребителят настоява за off-topic въпрос, повтори че можеш да помагаш само с програмата

ВАЖНО:
- НЕ давай медицински съвети или диагнози
- При здравословни оплаквания -> препоръчвай консултация с лекар
- НЕ обещавай конкретни резултати
- Фокусирай се върху lifestyle оптимизации

${context.programContext ? buildProgramContextPrompt(context.programContext) : ''}
${buildKnowledgeBasePrompt()}`
}

/**
 * Generate proactive greeting based on user context (no AI call needed)
 */
export function getProactiveGreeting(context: UserContext): string {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Добро утро' : hour < 18 ? 'Добър ден' : 'Добър вечер'

  // Check for incomplete tasks
  if (context.completedTasks < context.totalTasks) {
    const remaining = context.totalTasks - context.completedTasks
    return `${greeting}, ${context.firstName}! Имаш ${remaining} ${remaining === 1 ? 'незавършена задача' : 'незавършени задачи'} за днес. Как мога да ти помогна?`
  }

  // High progress - celebrate!
  if (context.progressScore >= 80) {
    return `${greeting}, ${context.firstName}! Браво за страхотния прогрес - ${context.progressScore} точки! Продължавай така!`
  }

  // Good progress
  if (context.progressScore >= 50) {
    return `${greeting}, ${context.firstName}! На добър път си с ${context.progressScore} точки. Какво мога да направя за теб днес?`
  }

  // Default greeting
  return `${greeting}, ${context.firstName}! Готов ли си за Ден ${context.programDay} от твоята програма?`
}

/**
 * Call OpenRouter API with streaming support and automatic fallback
 */
export async function streamCoachResponse(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  // Try models in order of preference (8 models for maximum availability)
  const modelsToTry = [
    FREE_MODELS.primary,
    FREE_MODELS.fallback1,
    FREE_MODELS.fallback2,
    FREE_MODELS.fallback3,
    FREE_MODELS.fallback4,
    FREE_MODELS.fallback5,
    FREE_MODELS.fallback6,
    FREE_MODELS.fallback7,
  ]

  let lastError: Error | null = null

  for (const model of modelsToTry) {
    console.log(`Trying model: ${model}`)

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://testograph.eu',
          'X-Title': 'Testograph AI Coach',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          stream: true,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      // If successful, return the stream
      if (response.ok && response.body) {
        console.log(`Success with model: ${model}`)
        return response.body
      }

      // If rate limited (429), try next model
      if (response.status === 429) {
        const errorText = await response.text()
        console.warn(`Model ${model} rate limited (429), trying next...`, errorText)
        lastError = new Error(`Rate limited: ${model}`)
        continue
      }

      // Other errors - log but try next model
      const errorText = await response.text()
      console.error(`Model ${model} error:`, response.status, errorText)
      lastError = new Error(`OpenRouter API error: ${response.status}`)
      continue
    } catch (fetchError) {
      console.error(`Fetch error for model ${model}:`, fetchError)
      lastError = fetchError as Error
      continue
    }
  }

  // All models failed
  console.error('All models failed. Last error:', lastError?.message)
  throw new Error('Всички AI модели са временно заети. Моля, опитай отново след минута.')
}

/**
 * Call OpenRouter API without streaming (for simple requests) with automatic fallback
 */
export async function getCoachResponse(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  // Try models in order of preference (8 models for maximum availability)
  const modelsToTry = [
    FREE_MODELS.primary,
    FREE_MODELS.fallback1,
    FREE_MODELS.fallback2,
    FREE_MODELS.fallback3,
    FREE_MODELS.fallback4,
    FREE_MODELS.fallback5,
    FREE_MODELS.fallback6,
    FREE_MODELS.fallback7,
  ]

  let lastError: Error | null = null

  for (const model of modelsToTry) {
    console.log(`[Non-streaming] Trying model: ${model}`)

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://testograph.eu',
          'X-Title': 'Testograph AI Coach',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          stream: false,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[Non-streaming] Success with model: ${model}`)
        return data.choices?.[0]?.message?.content || 'Съжалявам, възникна грешка.'
      }

      // If rate limited (429), try next model
      if (response.status === 429) {
        const errorText = await response.text()
        console.warn(`[Non-streaming] Model ${model} rate limited (429), trying next...`, errorText)
        lastError = new Error(`Rate limited: ${model}`)
        continue
      }

      // Other errors
      const errorText = await response.text()
      console.error(`[Non-streaming] Model ${model} error:`, response.status, errorText)
      lastError = new Error(`OpenRouter API error: ${response.status}`)
      continue
    } catch (fetchError) {
      console.error(`[Non-streaming] Fetch error for model ${model}:`, fetchError)
      lastError = fetchError as Error
      continue
    }
  }

  // All models failed
  console.error('[Non-streaming] All models failed. Last error:', lastError?.message)
  return 'Всички AI модели са временно заети. Моля, опитай отново след минута.'
}

// Rate limiting helper
const userLimits = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 15 // requests per minute
const RATE_WINDOW = 60000 // 1 minute in ms

export function checkRateLimit(email: string): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const now = Date.now()
  const userLimit = userLimits.get(email)

  // First request or window expired
  if (!userLimit || now > userLimit.resetTime) {
    userLimits.set(email, { count: 1, resetTime: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: RATE_WINDOW }
  }

  // Check if over limit
  if (userLimit.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: userLimit.resetTime - now,
    }
  }

  // Increment and allow
  userLimit.count++
  return {
    allowed: true,
    remaining: RATE_LIMIT - userLimit.count,
    resetIn: userLimit.resetTime - now,
  }
}
