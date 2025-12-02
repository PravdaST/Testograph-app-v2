import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
)

// All valid event types
const VALID_EVENT_TYPES = [
  'step_entered',
  'step_exited',
  'answer_selected',
  'back_clicked',
  'quiz_abandoned',
  'page_hidden',
  'page_visible',
  'quiz_completed',
  'results_viewed',
  'offer_clicked'
]

interface TrackStepRequest {
  session_id: string
  category: 'libido' | 'energy' | 'muscle'
  step_number: number
  question_id?: string
  event_type: string
  time_spent_seconds?: number
  answer_value?: string
  metadata?: Record<string, any>
}

/**
 * POST /api/quiz/track-step
 * Records quiz step events for funnel analysis
 * Supports both JSON and text/plain (sendBeacon) requests
 */
export async function POST(request: NextRequest) {
  try {
    // Handle both JSON and sendBeacon (text/plain) requests
    let body: TrackStepRequest
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('text/plain')) {
      // sendBeacon sends as text/plain
      const text = await request.text()
      body = JSON.parse(text)
    } else {
      body = await request.json()
    }

    const {
      session_id,
      category,
      step_number,
      question_id,
      event_type,
      time_spent_seconds,
      answer_value,
      metadata = {}
    } = body

    // Validate required fields
    if (!session_id || !category || step_number === undefined || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, category, step_number, event_type' },
        { status: 400 }
      )
    }

    // Validate category
    if (!['libido', 'energy', 'muscle'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be libido, energy, or muscle' },
        { status: 400 }
      )
    }

    // Validate event_type
    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Insert the event
    const { data, error } = await supabase
      .from('quiz_step_events')
      .insert({
        session_id,
        category,
        step_number,
        question_id,
        event_type,
        time_spent_seconds,
        answer_value,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('[Quiz Track Step] Insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, event_id: data.id })

  } catch (error: any) {
    console.error('[Quiz Track Step] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track step' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/quiz/track-step
 * Returns step events for a session (for debugging)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const session_id = searchParams.get('session_id')

  if (!session_id) {
    return NextResponse.json(
      { error: 'session_id is required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('quiz_step_events')
    .select('*')
    .eq('session_id', session_id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events: data })
}
