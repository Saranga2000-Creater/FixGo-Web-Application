import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Find Nearby Shops' }).click();
  await page.goto('http://localhost:5173/login');
  await page.locator('svg').click();
  await page.getByRole('banner').getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'you@example.com' }).click();
  await page.getByRole('textbox', { name: 'you@example.com' }).fill('kamal.perera@gmail.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Explicitly wait for the login to succeed and navigate to the dashboard
  await page.waitForURL('**/services', { timeout: 15000 });
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.getByRole('button', { name: 'Repair Status' }).click();
  await page.getByRole('button', { name: 'Service History' }).click();
  await page.getByRole('button', { name: 'Reviews & Ratings' }).click();
  await page.getByRole('button', { name: 'Notifications' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
});