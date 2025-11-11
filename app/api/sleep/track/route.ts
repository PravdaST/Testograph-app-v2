import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/sleep/track?email={email}&date={date}
 * Get sleep tracking data for specific date
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')

    if (!email || !date) {
      return NextResponse.json(
        { error: 'Email and date are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('sleep_tracking')
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching sleep data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sleep data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hours: data?.hours_slept || 0,
      quality: data?.quality_rating || 0,
      feeling: data?.feeling || null,
      notes: data?.notes || null,
    })
  } catch (error) {
    console.error('Error in sleep track GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sleep/track
 * Save sleep tracking data
 *
 * Body: { email, date, hours, quality, feeling, notes }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, date, hours, quality, feeling, notes } = body

    if (!email || !date || hours === undefined || quality === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Upsert sleep tracking data
    const { data, error } = await supabase
      .from('sleep_tracking')
      .upsert({
        email,
        date,
        hours_slept: hours,
        quality_rating: quality,
        feeling: feeling || 'neutral',
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email,date'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving sleep data:', error)
      return NextResponse.json(
        { error: 'Failed to save sleep data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error in sleep track POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
