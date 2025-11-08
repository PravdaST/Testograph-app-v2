import { createClient } from '@/lib/supabase/server'

export interface UserAccess {
  hasAccess: boolean
  accessType: 'sample' | 'full' | null
  accessEndDate: string | null
  daysRemaining: number
  capsulesRemaining: number
}

/**
 * Check if user has active access to the app
 * Access is based on TestoUp capsules inventory
 */
export async function checkUserAccess(email: string): Promise<UserAccess> {
  const supabase = await createClient()

  // Get user access info from quiz_results
  const { data: userAccess } = await supabase
    .from('quiz_results')
    .select('has_active_access, access_type, access_end_date')
    .eq('email', email)
    .single()

  // Get capsules inventory
  const { data: inventory } = await supabase
    .from('testoup_inventory')
    .select('capsules_remaining')
    .eq('email', email)
    .single()

  const capsulesRemaining = inventory?.capsules_remaining || 0
  // Access is granted if user has capsules remaining
  const hasAccess = capsulesRemaining > 0
  const accessEndDate = userAccess?.access_end_date || null

  // Calculate days remaining
  let daysRemaining = 0
  if (accessEndDate) {
    const endDate = new Date(accessEndDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  return {
    hasAccess,
    accessType: userAccess?.access_type || null,
    accessEndDate,
    daysRemaining,
    capsulesRemaining,
  }
}

/**
 * Require active access - throws error if user doesn't have access
 */
export async function requireAccess(email: string): Promise<UserAccess> {
  const access = await checkUserAccess(email)

  if (!access.hasAccess) {
    throw new AccessDeniedError(
      'Достъпът ви е изтекъл. Моля, закупете TestoUp опаковка за да продължите.',
      access
    )
  }

  return access
}

/**
 * Custom error for access denied
 */
export class AccessDeniedError extends Error {
  public access: UserAccess

  constructor(message: string, access: UserAccess) {
    super(message)
    this.name = 'AccessDeniedError'
    this.access = access
  }
}
