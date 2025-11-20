import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

interface CompletionData {
  date: string
  completed: number
  total: number
}

/**
 * GET /api/user/progressive-score?email={email}&date={date}
 * Calculate and return progressive score for a specific day
 *
 * Logic:
 * - Start with user's initial quiz score (from user_programs.total_score)
 * - Each day with 100% compliance: +2 points
 * - Each day with 75% compliance: +1 point
 * - Each day with 50% compliance: 0 points (no change)
 * - Each day with 25% compliance: -1 point
 * - Each day with 0% compliance: -2 points
 * - Score range: 0-100 (capped)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const dateParam = searchParams.get('date')

    if (!email || !dateParam) {
      return NextResponse.json(
        { error: 'Email and date are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // 1. Get user's initial quiz score from quiz_results_v2
    const { data: quizResult, error: userError } = await (supabase
      .from('quiz_results_v2') as any)
      .select('total_score, created_at')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (userError || !quizResult) {
      return NextResponse.json(
        { error: 'User quiz result not found' },
        { status: 404 }
      )
    }

    const initialScore = quizResult.total_score
    const programStartDate = new Date(quizResult.created_at.split('T')[0]) // Date only, no time
    const requestedDate = new Date(dateParam)

    // If requested date is before program start, return initial score
    if (requestedDate < programStartDate) {
      return NextResponse.json({
        date: dateParam,
        score: initialScore,
        compliancePercentage: 0,
        isInitial: true,
        message: 'Date is before program start'
      })
    }

    // 2. Check if we already have calculated score for this date
    const { data: existingScore } = await (supabase
      .from('daily_progress_scores') as any)
      .select('*')
      .eq('email', email)
      .eq('date', dateParam)
      .maybeSingle()

    if (existingScore) {
      return NextResponse.json({
        date: dateParam,
        score: existingScore.score,
        compliancePercentage: existingScore.compliance_percentage,
        completedTasks: existingScore.completed_tasks,
        totalTasks: existingScore.total_tasks,
        fromCache: true
      })
    }

    // 3. Calculate progressive score from program start to requested date
    let currentScore = initialScore
    const dates: string[] = []

    // Generate all dates from program start to requested date
    const current = new Date(programStartDate)
    while (current <= requestedDate) {
      dates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }

    // Get completion data for all dates
    const { data: completionData } = await (supabase
      .from('user_daily_completion') as any)
      .select('date, completed, total')
      .eq('email', email)
      .in('date', dates)

    const completionMap = new Map<string, CompletionData>(
      completionData?.map((d: CompletionData) => [d.date, d]) || []
    )

    // Calculate score for each day
    const dailyScores: any[] = []

    for (const date of dates) {
      const dayData = completionMap.get(date)

      if (!dayData) {
        // No data = no compliance = -2 points
        currentScore = Math.max(0, Math.min(100, currentScore - 2))
        dailyScores.push({
          email,
          date,
          score: currentScore,
          compliance_percentage: 0,
          completed_tasks: 0,
          total_tasks: 4
        })
        continue
      }

      const compliancePercentage = Math.round((dayData.completed / dayData.total) * 100)
      let pointsChange = 0

      // Calculate points based on compliance
      if (compliancePercentage === 100) {
        pointsChange = 2
      } else if (compliancePercentage >= 75) {
        pointsChange = 1
      } else if (compliancePercentage >= 50) {
        pointsChange = 0
      } else if (compliancePercentage >= 25) {
        pointsChange = -1
      } else {
        pointsChange = -2
      }

      currentScore = Math.max(0, Math.min(100, currentScore + pointsChange))

      dailyScores.push({
        email,
        date,
        score: currentScore,
        compliance_percentage: compliancePercentage,
        completed_tasks: dayData.completed,
        total_tasks: dayData.total
      })
    }

    // 4. Save all calculated scores to database
    if (dailyScores.length > 0) {
      await (supabase
        .from('daily_progress_scores') as any)
        .upsert(dailyScores, {
          onConflict: 'email,date',
          ignoreDuplicates: false
        })
    }

    // 5. Return score for requested date
    const requestedScore = dailyScores.find(s => s.date === dateParam)

    return NextResponse.json({
      date: dateParam,
      score: requestedScore?.score || initialScore,
      compliancePercentage: requestedScore?.compliance_percentage || 0,
      completedTasks: requestedScore?.completed_tasks || 0,
      totalTasks: requestedScore?.total_tasks || 4,
      initialScore,
      pointsGained: (requestedScore?.score || initialScore) - initialScore,
      fromCache: false
    })

  } catch (error) {
    console.error('Error calculating progressive score:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
