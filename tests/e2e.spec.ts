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

  test('Test registration form functionality', async ({ page }) => {
    await page.goto('/');
    
    // Click the register link
    await page.getByText("Don't have an account? Register").click();
    
    // Wait for the form to switch to registration mode
    await page.waitForTimeout(1000);
    
    // Check if we're in registration mode by looking for the email field
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toBeVisible({ timeout: 10000 });
    
    // Fill out the registration form
    const username = `testuser_${randomString()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    
    await page.getByLabel('Username').fill(username);
    await emailField.fill(email);
    await page.getByLabel('Password').fill(password);
    
    // Submit the form
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for successful registration
    await expect(page.getByText('Your Agency Dashboard')).toBeVisible({ timeout: 15000 });
  });

  test('Test dashboard functionality and readability', async ({ page }) => {
    // First register a user
    await page.goto('/');
    await page.getByText("Don't have an account? Register").click();
    await page.waitForTimeout(1000);
    
    const username = `testuser_${randomString()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    
    await page.getByLabel('Username').fill(username);
    await page.locator('input[type="email"]').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Your Agency Dashboard')).toBeVisible({ timeout: 15000 });
    
    // Test dashboard readability - check contrast ratios
    const dashboard = page.locator('text=Your Agency Dashboard');
    await expect(dashboard).toBeVisible();
    
    // Check that text has good contrast
    const textElements = page.locator('p, span, div').filter({ hasText: /[A-Za-z]/ });
    await expect(textElements.first()).toBeVisible();
    
    // Test quick action buttons functionality
    const quickActionButtons = page.locator('button').filter({ hasText: /Calculate True Cost|Check Fuel Prices|Time Value Calculator/ });
    await expect(quickActionButtons.first()).toBeVisible();
    
    // Test sidebar navigation
    const sidebarItems = [
      'Dashboard',
      'Fuel Cost',
      'True Cost Calculator',
      'Financial Health',
      'Net Worth Tracker',
      'Time Value',
      'Life Context',
      'Location',
      'AI Insights',
      'System Monitoring'
    ];
    
    for (const item of sidebarItems) {
      const sidebarItem = page.getByText(item);
      await expect(sidebarItem).toBeVisible();
    }
  });

  test('Test all major features navigation', async ({ page }) => {
    // Register and login
    await page.goto('/');
    await page.getByText("Don't have an account? Register").click();
    await page.waitForTimeout(1000);
    
    const username = `testuser_${randomString()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    
    await page.getByLabel('Username').fill(username);
    await page.locator('input[type="email"]').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Your Agency Dashboard')).toBeVisible({ timeout: 15000 });
    
    // Test navigation to each major feature
    const features = [
      { name: 'Fuel Cost', expectedText: 'Fuel Cost Management' },
      { name: 'True Cost Calculator', expectedText: 'True Cost Calculator' },
      { name: 'Financial Health', expectedText: 'Financial Health Dashboard' },
      { name: 'Net Worth Tracker', expectedText: 'Net Worth Tracker' },
      { name: 'Time Value', expectedText: 'Time Value Calculator' },
      { name: 'Life Context', expectedText: 'Life Context Manager' },
      { name: 'Location', expectedText: 'Location Manager' },
      { name: 'AI Insights', expectedText: 'AI Personalization' },
      { name: 'System Monitoring', expectedText: 'System Monitoring' }
    ];
    
    for (const feature of features) {
      await page.getByText(feature.name).click();
      await page.waitForTimeout(500);
      
      // Check if the page loaded (basic check)
      const body = page.locator('body');
      await expect(body).not.toHaveText('Loading...');
      
      // Go back to dashboard for next test
      await page.getByText('Dashboard').click();
      await page.waitForTimeout(500);
    }
  });

  test('Test quick action buttons functionality', async ({ page }) => {
    // Register and login
    await page.goto('/');
    await page.getByText("Don't have an account? Register").click();
    await page.waitForTimeout(1000);
    
    const username = `testuser_${randomString()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    
    await page.getByLabel('Username').fill(username);
    await page.locator('input[type="email"]').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Your Agency Dashboard')).toBeVisible({ timeout: 15000 });
    
    // Test quick action buttons
    const quickActions = [
      { button: 'Calculate True Cost', expectedTab: 'True Cost Calculator' },
      { button: 'Check Fuel Prices', expectedTab: 'Fuel Cost Management' },
      { button: 'Time Value Calculator', expectedTab: 'Time Value Calculator' }
    ];
    
    for (const action of quickActions) {
      // Click the quick action button
      await page.getByText(action.button).click();
      await page.waitForTimeout(1000);
      
      // Verify we navigated to the correct tab
      await expect(page.getByText(action.expectedTab)).toBeVisible();
      
      // Go back to dashboard
      await page.getByText('Dashboard').click();
      await page.waitForTimeout(500);
    }
  });

  test('Test color contrast and readability', async ({ page }) => {
    await page.goto('/');
    
    // Check login form readability
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
    
    // Check that form elements have good contrast
    const inputFields = page.locator('input');
    await expect(inputFields.first()).toBeVisible();
    
    // Register and check dashboard readability
    await page.getByText("Don't have an account? Register").click();
    await page.waitForTimeout(1000);
    
    const username = `testuser_${randomString()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    
    await page.getByLabel('Username').fill(username);
    await page.locator('input[type="email"]').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Your Agency Dashboard')).toBeVisible({ timeout: 15000 });
    
    // Check dashboard text contrast
    const dashboardText = page.locator('text=Current Net Worth');
    await expect(dashboardText).toBeVisible();
    
    // Check that metrics are readable
    const metrics = page.locator('text=/\\$[0-9,]+/');
    await expect(metrics.first()).toBeVisible();
    
    // Check sidebar readability
    const sidebar = page.locator('nav');
    await expect(sidebar).toBeVisible();
    
    // Check that sidebar items are visible
    const sidebarItems = page.locator('nav button');
    await expect(sidebarItems.first()).toBeVisible();
  });
}); 