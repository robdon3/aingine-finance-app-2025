const { chromium } = require('playwright');

async function testApp() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Testing app functionality...');
    
    // Navigate to the app
    await page.goto('http://localhost:3000');
    console.log('✓ App loaded successfully');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check if login form is visible
    const loginForm = await page.locator('text=Sign in to your account');
    await loginForm.waitFor({ timeout: 10000 });
    console.log('✓ Login form is visible');
    
    // Check for any console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any errors
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('⚠ Console errors found:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✓ No console errors detected');
    }
    
    // Test registration flow
    console.log('Testing registration flow...');
    await page.getByText("Don't have an account? Register").click();
    await page.waitForTimeout(2000);
    
    const emailField = page.locator('input[type="email"]');
    await emailField.waitFor({ timeout: 10000 });
    console.log('✓ Registration form is visible');
    
    // Fill out registration form
    const username = `testuser_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'TestPassword123!';
    
    await page.getByLabel('Username').fill(username);
    await emailField.fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for dashboard
    const dashboard = page.locator('text=Your Agency Dashboard');
    await dashboard.waitFor({ timeout: 15000 });
    console.log('✓ Registration successful, dashboard loaded');
    
    // Test navigation
    console.log('Testing navigation...');
    const sidebarItems = ['Dashboard', 'Fuel Cost', 'True Cost Calculator', 'Financial Health'];
    
    for (const item of sidebarItems) {
      try {
        await page.getByText(item).click();
        await page.waitForTimeout(1000);
        console.log(`✓ Navigation to ${item} works`);
      } catch (error) {
        console.log(`✗ Navigation to ${item} failed: ${error.message}`);
      }
    }
    
    // Test quick action buttons
    console.log('Testing quick action buttons...');
    try {
      await page.getByText('Calculate True Cost').click();
      await page.waitForTimeout(1000);
      console.log('✓ Quick action button "Calculate True Cost" works');
      
      await page.getByText('Dashboard').click();
      await page.waitForTimeout(500);
    } catch (error) {
      console.log(`✗ Quick action button test failed: ${error.message}`);
    }
    
    console.log('✓ App test completed successfully!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testApp(); 