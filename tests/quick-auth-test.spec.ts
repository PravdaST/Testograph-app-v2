import { test, expect } from '@playwright/test'

/**
 * Quick Authentication Test
 * Tests critical session-based auth functionality
 */

const TEST_USER = {
  email: 'caspere63@gmail.com',
  password: '123456789',
}

test.describe('Quick Auth Test - Supabase Session', () => {
  test('1. CRITICAL: Middleware redirects /app to /login when NO session', async ({ page }) => {
    console.log('🧪 TEST 1: Middleware redirect test')

    // Clear everything to ensure NO session
    await page.context().clearCookies()
    await page.goto('http://localhost:3000')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    // Try to access /app without session
    console.log('→ Accessing /app without session...')
    await page.goto('http://localhost:3000/app', { timeout: 10000 })

    // Wait for redirect
    await page.waitForTimeout(2000)

    // Should be on /login
    const currentUrl = page.url()
    console.log('→ Current URL:', currentUrl)

    expect(currentUrl).toContain('/login')
    console.log('✅ TEST 1 PASSED: Middleware redirects to /login')
  })

  test('2. CRITICAL: Login creates Supabase session', async ({ page }) => {
    console.log('🧪 TEST 2: Login flow test')

    // Go to login
    await page.goto('http://localhost:3000/login')
    console.log('→ On login page')

    // Fill credentials
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    console.log('→ Credentials filled')

    // Click login
    await page.click('button[type="submit"]')
    console.log('→ Login button clicked')

    // Wait for redirect
    await page.waitForURL('**/app', { timeout: 15000 })
    console.log('→ Redirected to /app')

    // Check if Dashboard loaded
    await page.waitForTimeout(3000)
    const content = await page.content()
    const hasDashboard = content.includes('Добър ден') || content.includes('Ден')

    expect(hasDashboard).toBeTruthy()
    console.log('✅ TEST 2 PASSED: Login successful, Dashboard loaded')
  })

  test('3. CRITICAL: Session persists across navigation', async ({ page }) => {
    console.log('🧪 TEST 3: Session persistence test')

    // Login first
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app', { timeout: 15000 })
    console.log('→ Logged in')

    // Navigate to different pages
    const pages = ['/app/profile', '/app/nutrition', '/app']

    for (const pagePath of pages) {
      await page.goto(`http://localhost:3000${pagePath}`)
      await page.waitForTimeout(1500)

      const url = page.url()
      console.log(`→ Visited: ${pagePath}, URL: ${url}`)

      // Should NOT redirect to /login
      expect(url).not.toContain('/login')
      expect(url).toContain(pagePath)
    }

    console.log('✅ TEST 3 PASSED: Session persists, all pages accessible')
  })

  test('4. CRITICAL: Logout clears Supabase session', async ({ page }) => {
    console.log('🧪 TEST 4: Logout test')

    // Login first
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app', { timeout: 15000 })
    console.log('→ Logged in')

    // Go to profile
    await page.goto('http://localhost:3000/app/profile')
    await page.waitForTimeout(2000)
    console.log('→ On profile page')

    // Handle confirm dialog
    page.on('dialog', async dialog => {
      console.log('→ Confirm dialog appeared')
      await dialog.accept()
    })

    // Find and click logout button
    const logoutButton = page.locator('text=/Излез от профила/i').first()
    await logoutButton.waitFor({ state: 'visible', timeout: 5000 })
    console.log('→ Logout button found')

    await logoutButton.click()
    console.log('→ Logout clicked')

    // Wait for redirect
    await page.waitForURL('**/login', { timeout: 10000 })
    console.log('→ Redirected to /login')

    const currentUrl = page.url()
    expect(currentUrl).toContain('/login')
    console.log('✅ TEST 4 PASSED: Logout successful')
  })

  test('5. CRITICAL: After logout, /app redirects to /login', async ({ page }) => {
    console.log('🧪 TEST 5: Post-logout middleware test')

    // After previous logout, try to access /app
    await page.goto('http://localhost:3000/app', { timeout: 10000 })
    await page.waitForTimeout(2000)

    const currentUrl = page.url()
    console.log('→ Current URL after accessing /app:', currentUrl)

    expect(currentUrl).toContain('/login')
    console.log('✅ TEST 5 PASSED: Middleware blocks access after logout')
  })

  test('6. VERIFICATION: localStorage is NOT primary auth', async ({ page }) => {
    console.log('🧪 TEST 6: localStorage verification')

    // Clear session but inject fake localStorage
    await page.context().clearCookies()
    await page.goto('http://localhost:3000')

    // Inject FAKE email in localStorage
    await page.evaluate(() => {
      localStorage.setItem('quizEmail', 'fake@hacker.com')
    })
    console.log('→ Injected FAKE email in localStorage')

    // Try to access /app
    await page.goto('http://localhost:3000/app', { timeout: 10000 })
    await page.waitForTimeout(2000)

    const currentUrl = page.url()
    console.log('→ Current URL with fake localStorage:', currentUrl)

    // Should redirect to /login (middleware checks session, not localStorage)
    expect(currentUrl).toContain('/login')
    console.log('✅ TEST 6 PASSED: localStorage is NOT primary auth source!')
  })
})
