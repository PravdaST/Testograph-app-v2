import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/measurements
 * Fetch all body measurements for the authenticated user
 *
 * Query params:
 *  - limit (optional): Number of records to return (default: 30)
 * Returns: Array of measurements sorted by date DESC
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '30', 10)

    const supabase = await createClient()

    // 1. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    // 2. Fetch measurements
    const supabaseService = createServiceClient()
    const { data: measurements, error: fetchError } = await (supabaseService
      .from('body_measurements') as any)
      .select('*')
      .eq('email', email)
      .order('date', { ascending: false })
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching measurements:', fetchError)
      return NextResponse.json(
        { error: 'Грешка при зареждане на измерванията' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      measurements: measurements || [],
      count: measurements?.length || 0,
    })
  } catch (error) {
    console.error('Error in GET measurements:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/measurements
 * Add or update a body measurement record
 *
 * Body (JSON):
 *  - date: Date string (YYYY-MM-DD) - REQUIRED
 *  - weight?: Weight in kg
 *  - body_fat_pct?: Body fat percentage
 *  - waist?: Waist circumference in cm
 *  - chest?: Chest circumference in cm
 *  - arms?: Arms circumference in cm
 *  - legs?: Legs circumference in cm
 *  - notes?: Optional notes
 *
 * Note: At least one measurement field must be provided
 * If measurement exists for date, it will be updated (UPSERT)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    // 2. Parse body
    const body = await request.json()
    const { date, weight, body_fat_pct, waist, chest, arms, legs, notes } = body

    if (!date) {
      return NextResponse.json(
        { error: 'Датата е задължителна' },
        { status: 400 }
      )
    }

    // Validate that at least one measurement is provided
    if (!weight && !body_fat_pct && !waist && !chest && !arms && !legs) {
      return NextResponse.json(
        { error: 'Моля въведете поне едно измерване' },
        { status: 400 }
      )
    }

    // 3. Prepare measurement data
    const measurementData: any = {
      email,
      date,
      updated_at: new Date().toISOString(),
    }

    if (weight !== undefined) measurementData.weight = weight ? parseFloat(weight) : null
    if (body_fat_pct !== undefined) measurementData.body_fat_pct = body_fat_pct ? parseFloat(body_fat_pct) : null
    if (waist !== undefined) measurementData.waist = waist ? parseFloat(waist) : null
    if (chest !== undefined) measurementData.chest = chest ? parseFloat(chest) : null
    if (arms !== undefined) measurementData.arms = arms ? parseFloat(arms) : null
    if (legs !== undefined) measurementData.legs = legs ? parseFloat(legs) : null
    if (notes !== undefined) measurementData.notes = notes || null

    // 4. Upsert measurement (insert or update if exists for same date)
    const supabaseService = createServiceClient()
    const { data: measurement, error: upsertError } = await (supabaseService
      .from('body_measurements') as any)
      .upsert(measurementData, {
        onConflict: 'email,date',
      })
      .select()
      .single()

    if (upsertError) {
      console.error('Error upserting measurement:', upsertError)
      return NextResponse.json(
        { error: 'Грешка при запазване на измерването' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Измерването е запазено успешно',
      measurement,
    })
  } catch (error) {
    console.error('Error in POST measurements:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/measurements
 * Delete a body measurement record
 *
 * Query params:
 *  - id: Measurement ID (UUID)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const measurementId = searchParams.get('id')

    if (!measurementId) {
      return NextResponse.json(
        { error: 'ID на измерването е задължително' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    const supabaseService = createServiceClient()

    // 2. Verify ownership and delete
    const { error: deleteError } = await (supabaseService
      .from('body_measurements') as any)
      .delete()
      .eq('id', measurementId)
      .eq('email', email)

    if (deleteError) {
      console.error('Error deleting measurement:', deleteError)
      return NextResponse.json(
        { error: 'Грешка при изтриване на измерването' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Измерването е изтрито успешно',
    })
  } catch (error) {
    console.error('Error in DELETE measurements:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
