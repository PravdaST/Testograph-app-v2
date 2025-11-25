/**
 * Water Tracking API
 * Track daily water intake (glasses)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = session.user.email
  if (!email) {
    return NextResponse.json({ error: 'No email in session' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  try {
    const { data, error } = await (supabase
      .from('water_tracking') as any)
      .select('glasses')
      .eq('email', email)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (not an error for us)
      throw error
    }

    return NextResponse.json({
      success: true,
      glasses: data?.glasses || 0,
      date,
    })
  } catch (error) {
    console.error('Error fetching water tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch water tracking' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = session.user.email
  if (!email) {
    return NextResponse.json({ error: 'No email in session' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { date, glasses } = body

    if (glasses === undefined || glasses < 0 || glasses > 20) {
      return NextResponse.json(
        { error: 'Invalid glasses value (0-20)' },
        { status: 400 }
      )
    }

    const targetDate = date || new Date().toISOString().split('T')[0]

    // Upsert water tracking
    const { data, error } = await (supabase
      .from('water_tracking') as any)
      .upsert(
        {
          email,
          date: targetDate,
          glasses,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email,date',
        }
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      glasses: data.glasses,
      date: targetDate,
    })
  } catch (error) {
    console.error('Error updating water tracking:', error)
    return NextResponse.json(
      { error: 'Failed to update water tracking' },
      { status: 500 }
    )
  }
}
