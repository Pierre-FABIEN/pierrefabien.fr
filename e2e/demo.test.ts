import { expect, test } from '@playwright/test';

test('home page loads and shows the about section', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Pierre Fabien/);
	await expect(page.locator('.about')).toContainText('web developer');
});
