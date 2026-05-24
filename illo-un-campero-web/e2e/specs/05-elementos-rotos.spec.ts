import { test, expect } from '../fixtures/qa-test';
import { dismissCookiesIfVisible } from '../support/selectors';

const publicRoutes = ['/restaurantes', '/carta', '/login', '/registro', '/carrito', '/privacidad'];

test.describe('Elementos rotos y assets', () => {
  for (const route of publicRoutes) {
    test(`no hay imagenes rotas ni enlaces internos vacios en ${route}`, async ({ qaPage }) => {
      await qaPage.goto(route, { waitUntil: 'domcontentloaded' });
      await dismissCookiesIfVisible(qaPage);

      const brokenImages = await qaPage.locator('img').evaluateAll((images) =>
        images
          .filter((img) => img instanceof HTMLImageElement)
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.getAttribute('src') || ''),
      );
      expect(brokenImages, 'No debe haber imagenes rotas').toEqual([]);

      const brokenInternalLinks = await qaPage.locator('a').evaluateAll((links) =>
        links
          .map((link) => link.getAttribute('href'))
          .filter((href) => href === '' || href === '#'),
      );
      expect(brokenInternalLinks, 'No debe haber enlaces internos vacios').toEqual([]);
    });
  }

  test('carrito vacio ofrece una salida hacia carta', async ({ qaPage }) => {
    await qaPage.goto('/carrito', { waitUntil: 'domcontentloaded' });
    await dismissCookiesIfVisible(qaPage);

    await expect(qaPage.locator('.carrito-vacio')).toBeVisible();
    await qaPage.getByRole('button', { name: /carta|menu/i }).click();
    await expect(qaPage).toHaveURL(/\/carta/);
  });
});
