import { test, expect } from '../fixtures/qa-test';
import { dismissCookiesIfVisible } from '../support/selectors';

test.describe('Formularios publicos de autenticacion', () => {
  test('login valida email invalido sin llamar a Firebase', async ({ qaPage }) => {
    await qaPage.goto('/login', { waitUntil: 'domcontentloaded' });
    await dismissCookiesIfVisible(qaPage);

    const form = qaPage.locator('form');
    await form.locator('input[name="email"]').fill('correo-invalido');
    await form.locator('input[name="password"]').fill('123456');
    await form.getByRole('button', { name: /iniciar|login/i }).click();

    await expect(qaPage.locator('.error-text')).toBeVisible();
    await expect(qaPage).toHaveURL(/\/login/);
  });

  test('registro valida campos obligatorios, telefono, email y password', async ({ qaPage }) => {
    await qaPage.goto('/registro', { waitUntil: 'domcontentloaded' });
    await dismissCookiesIfVisible(qaPage);

    const form = qaPage.locator('form');
    await form.getByRole('button', { name: /registr/i }).click();
    await expect(qaPage.locator('.error-text')).toHaveCount(5);

    await form.locator('input[name="nombre"]').fill('Miguel');
    await form.locator('input[name="apellidos"]').fill('QA');
    await form.locator('input[name="telefono"]').fill('123');
    await form.locator('input[name="email"]').fill('mal');
    await form.locator('input[name="password"]').fill('123');
    await form.getByRole('button', { name: /registr/i }).click();

    await expect(qaPage.locator('.error-text')).toHaveCount(3);
    await expect(qaPage.locator('.error-text').nth(0)).toContainText(/telefono|teléfono/i);
    await expect(qaPage.locator('.error-text').nth(1)).toContainText(/correo|email/i);
    await expect(qaPage.locator('.error-text').nth(2)).toContainText(/contraseña|password/i);
    await expect(qaPage).toHaveURL(/\/registro/);
  });
});
