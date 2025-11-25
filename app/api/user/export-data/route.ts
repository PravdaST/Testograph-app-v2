import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/export-data
 * Export all user data in JSON format (GDPR compliance)
 *
 * Exports data from:
 * - quiz_results_v2 (program data)
 * - meal_completions
 * - workout_sessions
 * - workout_exercise_sets
 * - sleep_tracking
 * - testoup_tracking
 * - testoup_inventory
 * - daily_progress_scores
 * - feedback_submissions
 * - progress_photos
 * - body_measurements
 *
 * Returns: JSON file download with all user data
 */
export async function GET(request: NextRequest) {
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

    const supabaseService = createServiceClient()

    // 2. Collect all user data from all tables
    const tables = [
      'quiz_results_v2',
      'meal_completions',
      'workout_sessions',
      'workout_exercise_sets',
      'sleep_tracking',
      'testoup_tracking',
      'testoup_inventory',
      'daily_progress_scores',
      'feedback_submissions',
      'progress_photos',
      'body_measurements',
    ]

    const exportData: any = {
      exportDate: new Date().toISOString(),
      userEmail: email,
      accountCreatedAt: session.user.created_at,
      data: {},
    }

    // Fetch data from each table in parallel
    const fetchPromises = tables.map(async (table) => {
      try {
        const { data, error } = await (supabaseService
          .from(table) as any)
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false })

        if (error) {
          console.error(`Error fetching ${table}:`, error)
          return { table, data: null, error: error.message }
        }

        return { table, data: data || [], error: null }
      } catch (err) {
        console.error(`Exception fetching ${table}:`, err)
        return { table, data: null, error: String(err) }
      }
    })

    const results = await Promise.all(fetchPromises)

    // Organize results by table
    results.forEach(({ table, data, error }) => {
      if (error) {
        exportData.data[table] = {
          error,
          count: 0,
        }
      } else {
        exportData.data[table] = {
          count: data?.length || 0,
          records: data || [],
        }
      }
    })

    // 3. Calculate summary statistics
    exportData.summary = {
      totalTables: tables.length,
      tablesWithData: Object.values(exportData.data).filter(
        (t: any) => t.count > 0
      ).length,
      totalRecords: Object.values(exportData.data).reduce(
        (sum: number, t: any) => sum + (t.count || 0),
        0
      ),
    }

    // 4. Return as downloadable JSON
    const filename = `testograph_data_${email.replace('@', '_')}_${new Date().toISOString().split('T')[0]}.json`

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error in GET export-data:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
