/**
 * Date Helper Functions
 * Utilities for week calculations and date formatting
 */

/**
 * Get start of week (Monday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust if Sunday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of week (Sunday) for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  return weekEnd
}

/**
 * Get array of 7 days for the current week
 */
export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push(day)
  }
  return days
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < today
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate > today
}

/**
 * Format date to DD.MM.YYYY
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Get day name in Bulgarian (short)
 */
export function getDayNameShort(dayOfWeek: number): string {
  const names = ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб']
  return names[dayOfWeek]
}

/**
 * Get day name in Bulgarian (full)
 */
export function getDayNameFull(dayOfWeek: number): string {
  const names = [
    'Неделя',
    'Понеделник',
    'Вторник',
    'Сряда',
    'Четвъртък',
    'Петък',
    'Събота',
  ]
  return names[dayOfWeek]
}

/**
 * Get month name in Bulgarian
 */
export function getMonthName(month: number): string {
  const names = [
    'Януари',
    'Февруари',
    'Март',
    'Април',
    'Май',
    'Юни',
    'Юли',
    'Август',
    'Септември',
    'Октомври',
    'Ноември',
    'Декември',
  ]
  return names[month]
}

/**
 * Calculate day number in program (unlimited, continues past 30)
 */
export function getDayNumber(programStartDate: Date, currentDate: Date): number {
  const start = new Date(programStartDate)
  start.setHours(0, 0, 0, 0)

  const current = new Date(currentDate)
  current.setHours(0, 0, 0, 0)

  const diffTime = current.getTime() - start.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(diffDays + 1, 1) // No upper limit - continues counting indefinitely
}

/**
 * Check if program is completed (30 days passed)
 */
export function isProgramCompleted(programStartDate: Date, currentDate: Date = new Date()): boolean {
  const dayNumber = getDayNumber(programStartDate, currentDate)
  return dayNumber >= 30
}

/**
 * Get days remaining in program
 */
export function getDaysRemaining(programStartDate: Date, currentDate: Date = new Date()): number {
  const dayNumber = getDayNumber(programStartDate, currentDate)
  return Math.max(30 - dayNumber + 1, 0)
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startMonth = getMonthName(startDate.getMonth())
  const endMonth = getMonthName(endDate.getMonth())

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDay} - ${endDay} ${startMonth}`
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`
  }
}
