import { test, expect } from '@playwright/test'

/**
 * Authentication & Security Tests
 * Tests the new session-based authentication system
 */

const TEST_USER = {
  email: 'caspere63@gmail.com',
  password: '123456789',
}

test.describe('Authentication Security Tests', () => {
  test.describe.configure({ mode: 'serial' })

  test('1. Middleware: Should redirect to /login when accessing /app without session', async ({ page }) => {
    // Clear all cookies and storage to ensure no session
    await page.context().clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Try to access protected route
    await page.goto('/app')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Middleware redirect works - /app → /login')
  })

  test('2. Login Flow: Should login successfully with valid credentials', async ({ page }) => {
    // Go to login page
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // Fill login form
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)

    // Click login button
    await page.click('button[type="submit"]')

    // Wait for redirect to /app
    await page.waitForURL('/app', { timeout: 10000 })
    await expect(page).toHaveURL('/app')

    console.log('✅ Login successful - redirected to /app')
  })

  test('3. Dashboard: Should load user data correctly', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/app')

    // Wait for user data to load
    await page.waitForTimeout(2000)

    // Check if Dashboard elements are visible
    const greetingExists = await page.locator('text=/Добър/i').count() > 0
    expect(greetingExists).toBeTruthy()

    // Check if navigation is visible
    const bottomNavExists = await page.locator('[class*="bottom"]').count() > 0
    expect(bottomNavExists).toBeTruthy()

    console.log('✅ Dashboard loaded with user data')
  })

  test('4. Navigation: Should access all /app pages with valid session', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/app')

    // Test navigation to different pages
    const pages = [
      { path: '/app/profile', name: 'Profile' },
      { path: '/app/nutrition', name: 'Nutrition' },
      { path: '/app/sleep', name: 'Sleep' },
      { path: '/app/supplement', name: 'Supplement' },
      { path: '/app', name: 'Dashboard' }, // Back to dashboard
    ]

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path)
      await page.waitForTimeout(1000)

      // Check if page loaded (no redirect to login)
      const currentUrl = page.url()
      expect(currentUrl).toContain(pageInfo.path)
      console.log(`✅ ${pageInfo.name} page accessible`)
    }
  })

  test('5. Logout Flow: Should logout and redirect to /login', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/app')

    // Go to profile page
    await page.goto('/app/profile')
    await page.waitForTimeout(1000)

    // Find and click logout button
    const logoutButton = page.locator('text=/Излез от профила/i')
    await expect(logoutButton).toBeVisible({ timeout: 5000 })
    await logoutButton.click()

    // Confirm the dialog
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Сигурни ли сте')
      await dialog.accept()
    })

    // Wait for redirect to /login
    await page.waitForURL('/login', { timeout: 5000 })
    await expect(page).toHaveURL('/login')

    console.log('✅ Logout successful - redirected to /login')
  })

  test('6. Session Persistence: After logout, /app should redirect to /login', async ({ page }) => {
    // Previous test should have logged out
    // Try to access /app
    await page.goto('/app')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Session cleared - middleware blocks access to /app')
  })

  test('7. API Authorization: Should return 401 without session', async ({ page, request }) => {
    // Clear session
    await page.context().clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Try to call API directly
    const response = await request.get('/api/user/program?email=test@example.com')

    // Should get 401 Unauthorized
    expect(response.status()).toBe(401)
    console.log('✅ API returns 401 without session')
  })

  test('8. Public Routes: Should access public routes without login', async ({ page }) => {
    // Clear session
    await page.context().clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Test public routes
    const publicRoutes = [
      { path: '/', name: 'Home' },
      { path: '/quiz', name: 'Quiz' },
      { path: '/login', name: 'Login' },
    ]

    for (const route of publicRoutes) {
      await page.goto(route.path)
      await page.waitForTimeout(500)

      // Should NOT redirect to login
      const currentUrl = page.url()
      expect(currentUrl).toContain(route.path)
      expect(currentUrl).not.toContain('/login')
      console.log(`✅ ${route.name} accessible without login`)
    }
  })
})
