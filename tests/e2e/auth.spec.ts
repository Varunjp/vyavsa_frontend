import { test, expect } from '@playwright/test';

test.describe('Authentication Journey', () => {
  test('landing page loads with navigation and hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vyavsa Bill Book/);
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });

  test('navigates to login page and displays validation errors on empty submit', async ({
    page,
  }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Sign In to Vyavsa/i })).toBeVisible();

    // Click submit without entering credentials
    await page.getByRole('button', { name: /Sign In to Workspace/i }).click();

    // Validation error should appear
    await expect(page.getByText(/Please enter a valid email address/i)).toBeVisible();
  });
});
