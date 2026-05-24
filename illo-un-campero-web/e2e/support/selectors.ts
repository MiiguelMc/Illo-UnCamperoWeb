import { expect, type Locator, type Page } from '@playwright/test';

export function appShell(page: Page) {
  return {
    header: page.locator('app-header, app-header-user, .main-header').first(),
    footer: page.locator('app-footer, footer').first(),
    cookieBanner: page.locator('app-cookie-banner').first(),
  };
}

export async function dismissCookiesIfVisible(page: Page) {
  const acceptButton = page.getByRole('button', { name: /acept|accept|ok/i }).first();
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }
}

export async function expectVisible(locator: Locator, message: string) {
  await expect(locator, message).toBeVisible();
}
