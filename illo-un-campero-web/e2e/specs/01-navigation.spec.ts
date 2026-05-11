import { test, expect } from '../fixtures/qa-test';
import { appShell, dismissCookiesIfVisible } from '../support/selectors';

test.describe('Navegacion publica', () => {
  test.beforeEach(async ({ qaPage }) => {
    await qaPage.goto('/restaurantes', { waitUntil: 'domcontentloaded' });
    await dismissCookiesIfVisible(qaPage);
  });

  test('carga la home publica con cabecera, contenido y footer', async ({ qaPage }) => {
    await expect(qaPage).toHaveURL(/\/restaurantes/);
    await expect(appShell(qaPage).header).toBeVisible();
    await expect(qaPage.locator('main.content-wrapper')).toBeVisible();
    await expect(qaPage.locator('h1')).toBeVisible();
    await expect(appShell(qaPage).footer).toBeVisible();
  });

  test('navega desde restaurantes a carta, login y registro', async ({ qaPage }) => {
    await qaPage.getByRole('link', { name: /carta|menu/i }).first().click();
    await expect(qaPage).toHaveURL(/\/carta/);
    await expect(qaPage.locator('.carta-page')).toBeVisible();

    await qaPage.getByRole('button', { name: /iniciar|login|sesion|session/i }).first().click();
    await expect(qaPage).toHaveURL(/\/login/);
    await expect(qaPage.locator('form')).toBeVisible();

    await qaPage.goto('/restaurantes');
    await qaPage.getByRole('button', { name: /registr/i }).first().click();
    await expect(qaPage).toHaveURL(/\/registro/);
    await expect(qaPage.locator('form')).toBeVisible();
  });

  test('redirige rutas desconocidas a restaurantes', async ({ qaPage }) => {
    await qaPage.goto('/ruta-que-no-existe', { waitUntil: 'domcontentloaded' });
    await expect(qaPage).toHaveURL(/\/restaurantes/);
  });
});
