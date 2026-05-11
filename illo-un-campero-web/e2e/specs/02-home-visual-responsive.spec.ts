import { test, expect } from '../fixtures/qa-test';
import { dismissCookiesIfVisible } from '../support/selectors';
import { expectBasicAccessibility } from '../support/a11y';
import { expectWebVitals } from '../support/performance';

test.describe('Restaurantes - visual y responsive', () => {
  test.beforeEach(async ({ qaPage }) => {
    await qaPage.goto('/restaurantes', { waitUntil: 'domcontentloaded' });
    await dismissCookiesIfVisible(qaPage);
  });

  test('muestra hero, llamadas a la accion y secciones principales', async ({ qaPage }) => {
    await expect(qaPage.locator('.hero')).toBeVisible();
    await expect(qaPage.getByRole('link', { name: /pedir|order|menu/i }).first()).toBeVisible();
    await expect(qaPage.locator('.steps-section')).toBeVisible();
    await expect(qaPage.locator('.footer-info')).toBeVisible();
  });

  test('captura baseline visual de la home', async ({ qaPage }) => {
    await expect(qaPage).toHaveScreenshot('restaurantes-full-page.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [qaPage.locator('iframe')],
    });
  });

  test('cumple checks basicos de accesibilidad y estabilidad visual', async ({ qaPage }) => {
    await expectBasicAccessibility(qaPage);
    await expectWebVitals(qaPage);
  });

  test('en movil muestra menu hamburguesa usable', async ({ qaPage, isMobile }) => {
    test.skip(!isMobile, 'Este escenario solo aplica al proyecto movil');

    const hamburger = qaPage.locator('.hamburger-btn');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(qaPage.locator('.mobile-overlay.open')).toBeVisible();
    await qaPage.getByRole('link', { name: /carta|menu/i }).first().click();
    await expect(qaPage).toHaveURL(/\/carta/);
  });
});
