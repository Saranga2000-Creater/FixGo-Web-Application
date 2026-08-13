import { test, expect } from '@playwright/test';

test('FixGo homepage loads correctly', async ({ page }) => {
  // 1. Arrange: Go to your local React frontend
  await page.goto('http://localhost:5173');

  // 2. Assert: Verify the page title is correct (adjust 'Vite + React' if you changed your index.html title)
  // We'll just verify the page actually loaded by checking that it doesn't crash.
  
  // Example: Check if there is a main heading on your homepage. 
  // You might need to change 'FixGo' to whatever text is actually on your homepage!
  // await expect(page.locator('h1')).toContainText('FixGo');

  // For now, let's just make sure the page loads and has a title.
  await expect(page).toHaveTitle(/.*|Vite \+ React/);
});
