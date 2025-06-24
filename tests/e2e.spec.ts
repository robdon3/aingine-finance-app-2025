import { test, expect } from '@playwright/test';

function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

test.describe('Aingen App E2E', () => {
  test('Homepage loads and login form is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Register, login, and navigate sidebar', async ({ page }) => {
    await page.goto('/');
    // Click the register link at the bottom
    await page.getByText("Don't have an account? Register").click();
    // Wait for the registration form to appear (look for Email label)
    await expect(page.getByLabel('Email')).toBeVisible({ timeout: 5000 });
    // Fill registration form using label selectors
    const username = `testuser_${randomString()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').first().fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    // Submit registration
    await page.getByRole('button', { name: /register|create account/i }).click();
    // Wait for dashboard to load (look for sidebar)
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });
    // Navigate to Fuel Cost
    await page.getByRole('button', { name: 'Fuel Cost' }).click();
    await expect(page.getByText('Fuel Cost')).toBeVisible();
    // Navigate to Net Worth Tracker
    await page.getByRole('button', { name: 'Net Worth Tracker' }).click();
    await expect(page.getByText('Net Worth Tracker')).toBeVisible();
    // Navigate to System Monitoring
    await page.getByRole('button', { name: 'System Monitoring' }).click();
    await expect(page.getByText('System Monitoring')).toBeVisible();
  });

  // Add more tests here as needed, e.g. login, navigation, etc.
}); 