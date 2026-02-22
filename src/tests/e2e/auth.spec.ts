import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login with email and password', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should create a new project', async ({ page }) => {
    await page.goto('/projects/new')

    // Fill project form
    await page.fill('input[name="title"]', 'Test Project')
    await page.fill('textarea[name="description"]', 'Test project description')
    await page.selectOption('select[name="priority"]', 'HIGH')
    
    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to project page
    await expect(page).toHaveURL(/\/projects\/[^/]+/)
    await expect(page.getByText('Test Project')).toBeVisible()
  })

  test('should add tasks to project', async ({ page }) => {
    // Navigate to existing project
    await page.goto('/projects/test-project')

    // Click add task button
    await page.click('button:has-text("Add Task")')

    // Fill task form
    await page.fill('input[name="title"]', 'New Task')
    await page.fill('textarea[name="description"]', 'Task description')
    await page.selectOption('select[name="priority"]', 'MEDIUM')
    
    await page.click('button:has-text("Create Task")')

    // Task should appear in the list
    await expect(page.getByText('New Task')).toBeVisible()
  })
})