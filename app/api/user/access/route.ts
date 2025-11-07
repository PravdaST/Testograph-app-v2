import { NextRequest, NextResponse } from 'next/server'
import { checkUserAccess } from '@/lib/middleware/access-control'

/**
 * GET /api/user/access
 * Check user's access status to the app
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const access = await checkUserAccess(email)

    return NextResponse.json(access)
  } catch (error) {
    console.error('Error checking user access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
