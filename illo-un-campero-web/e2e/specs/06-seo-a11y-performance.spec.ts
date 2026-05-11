import { test, expect } from '../fixtures/qa-test';
import { expectBasicAccessibility } from '../support/a11y';
import { expectBasicPerformance } from '../support/performance';

test.describe('SEO tecnico, accesibilidad y rendimiento basico', () => {
  test('restaurantes tiene metadatos minimos y rendimiento aceptable', async ({ qaPage }) => {
    await qaPage.goto('/restaurantes', { waitUntil: 'domcontentloaded' });

    await expect(qaPage).toHaveTitle(/illo|campero/i);
    await expect(qaPage.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/i);

    const description = qaPage.locator('meta[name="description"]');
    await expect(description, 'Debe existir meta description').toHaveCount(1);
    await expect(description).toHaveAttribute('content', /.+/);

    await expectBasicAccessibility(qaPage);
    await expectBasicPerformance(qaPage);
  });

  test('carta mantiene estructura accesible minima', async ({ qaPage }) => {
    await qaPage.goto('/carta', { waitUntil: 'domcontentloaded' });

    await expectBasicAccessibility(qaPage);
    await expect(qaPage.locator('.search-container input')).toBeVisible();
  });
});
