import { test, expect } from '@playwright/test'

/**
 * Critical Authentication Tests - Fast & Focused
 * Tests ONLY the most critical security features
 */

const TEST_USER = {
  email: 'caspere63@gmail.com',
  password: '123456789',
}

test.describe('Critical Auth - Supabase Session Security', () => {
  test('CRITICAL #1: Middleware blocks /app without session', async ({ page }) => {
    // Clear all auth
    await page.context().clearCookies()
    await page.goto('http://localhost:3000')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    // Try to access protected route
    const response = await page.goto('http://localhost:3000/app')

    // Should redirect to /login
    await page.waitForTimeout(1000)
    const url = page.url()

    expect(url).toContain('/login')
    console.log('✅ Middleware blocks /app without session')
  })

  test('CRITICAL #2: Fake localStorage does NOT grant access', async ({ page }) => {
    // Clear session
    await page.context().clearCookies()
    await page.goto('http://localhost:3000')

    // Inject FAKE email in localStorage
    await page.evaluate(() => {
      localStorage.setItem('quizEmail', 'hacker@fake.com')
    })

    // Try to access protected route with fake localStorage
    await page.goto('http://localhost:3000/app')
    await page.waitForTimeout(1000)

    const url = page.url()

    // Should STILL redirect to /login (ignoring localStorage)
    expect(url).toContain('/login')
    console.log('✅ localStorage is NOT primary auth - session required!')
  })

  test('CRITICAL #3: Login creates valid session', async ({ page }) => {
    // Go to login
    await page.goto('http://localhost:3000/login')

    // Fill and submit
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')

    // Wait for redirect
    try {
      await page.waitForURL('**/app', { timeout: 10000 })
      console.log('✅ Login successful - session created')
    } catch (error) {
      console.error('❌ Login failed or timeout')
      throw error
    }
  })

  test('CRITICAL #4: Session persists on navigation', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app', { timeout: 10000 })

    // Navigate to different /app pages
    const testPages = ['/app/profile', '/app/nutrition', '/app']

    for (const testPage of testPages) {
      await page.goto(`http://localhost:3000${testPage}`)
      await page.waitForTimeout(500)

      const url = page.url()

      // Should NOT redirect to /login
      expect(url).toContain(testPage)
      expect(url).not.toContain('/login')
    }

    console.log('✅ Session persists across navigation')
  })
})
