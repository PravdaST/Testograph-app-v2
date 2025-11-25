import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/program-history
 * Fetch all quiz programs completed by the authenticated user
 *
 * Returns: Array of program records sorted by created_at DESC
 * Shows history of all programs user has completed (multiple quiz cycles)
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

    // 2. Fetch all quiz_results_v2 records for this user
    const supabaseService = createServiceClient()
    const { data: programs, error: fetchError } = await (supabaseService
      .from('quiz_results_v2') as any)
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching program history:', fetchError)
      return NextResponse.json(
        { error: 'Грешка при зареждане на историята' },
        { status: 500 }
      )
    }

    // 3. Process programs to calculate completion stats
    const processedPrograms = programs?.map((program: any) => {
      const startDate = new Date(program.completed_at || program.created_at)
      const endDate = program.program_end_date ? new Date(program.program_end_date) : null
      const today = new Date()

      // Calculate days in program
      let daysInProgram = 0
      if (program.completed_at) {
        const diffTime = today.getTime() - startDate.getTime()
        daysInProgram = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1)
      }

      // Calculate program progress %
      let progressPct = 0
      if (program.completed_at && endDate) {
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        progressPct = Math.min(Math.round((daysPassed / totalDays) * 100), 100)
      }

      // Determine program status
      let status: 'active' | 'completed' | 'abandoned' = 'abandoned'
      if (endDate && today <= endDate) {
        status = 'active'
      } else if (progressPct >= 90) {
        status = 'completed'
      }

      return {
        ...program,
        daysInProgram,
        progressPct,
        status,
      }
    }) || []

    return NextResponse.json({
      success: true,
      programs: processedPrograms,
      count: processedPrograms.length,
    })
  } catch (error) {
    console.error('Error in GET program-history:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/program-history?id={programId}
 * Delete a program from user's history (cannot delete active/current program)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('id')

    if (!programId) {
      return NextResponse.json(
        { error: 'Missing program ID' },
        { status: 400 }
      )
    }

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

    // 2. Check if program belongs to user and is not the current/active one
    const supabaseService = createServiceClient()

    // Get all programs to find the current one
    const { data: programs, error: fetchError } = await (supabaseService
      .from('quiz_results_v2') as any)
      .select('id, created_at')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching programs:', fetchError)
      return NextResponse.json(
        { error: 'Грешка при проверка на програмите' },
        { status: 500 }
      )
    }

    // Check if trying to delete the most recent (current) program
    if (programs && programs.length > 0 && programs[0].id === programId) {
      return NextResponse.json(
        { error: 'Не можете да изтриете текущата програма' },
        { status: 400 }
      )
    }

    // 3. Delete the program
    const { error: deleteError } = await (supabaseService
      .from('quiz_results_v2') as any)
      .delete()
      .eq('id', programId)
      .eq('email', email)

    if (deleteError) {
      console.error('Error deleting program:', deleteError)
      return NextResponse.json(
        { error: 'Грешка при изтриване на програмата' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Програмата е изтрита успешно',
    })
  } catch (error) {
    console.error('Error in DELETE program-history:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
