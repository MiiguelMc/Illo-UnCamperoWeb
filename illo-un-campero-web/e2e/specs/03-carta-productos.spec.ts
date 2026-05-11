import { test, expect } from '../fixtures/qa-test';
import { dismissCookiesIfVisible } from '../support/selectors';

test.describe('Carta - carga de datos, filtros y busqueda', () => {
  test.beforeEach(async ({ qaPage }) => {
    await qaPage.goto('/carta', { waitUntil: 'domcontentloaded' });
    await dismissCookiesIfVisible(qaPage);
  });

  test('carga productos desde la API y pinta tarjetas', async ({ qaPage }) => {
    const productsResponse = qaPage.waitForResponse((response) =>
      response.url().includes('/api/productos') && response.ok(),
    );

    await qaPage.reload({ waitUntil: 'domcontentloaded' });
    await productsResponse;

    await expect(qaPage.locator('app-producto-item').first()).toBeVisible();
    await expect(qaPage.locator('.producto-card').first()).toContainText(/\d|€/);
  });

  test('los filtros de categoria no rompen la pagina', async ({ qaPage }) => {
    const filters = qaPage.locator('.sticky-nav button');
    const total = await filters.count();
    expect(total, 'Debe haber filtros de categorias').toBeGreaterThanOrEqual(4);

    for (let index = 0; index < total; index++) {
      await filters.nth(index).click();
      await expect(filters.nth(index)).toHaveClass(/active/);
      await expect(qaPage.locator('.carta-page')).toBeVisible();
    }
  });

  test('la busqueda filtra productos sin errores', async ({ qaPage }) => {
    const search = qaPage.locator('.search-container input');
    await expect(search).toBeVisible();

    await search.fill('campero');
    await expect(qaPage.locator('.carta-page')).toBeVisible();

    await search.fill('zzzz-producto-inexistente-qa');
    await expect(qaPage.locator('app-producto-item')).toHaveCount(0);
  });

  test('abre modal de producto y permite sumar cantidad', async ({ qaPage }) => {
    await qaPage.locator('app-producto-item').first().click();
    await expect(qaPage.locator('.modal-content-slim')).toBeVisible();

    await qaPage.locator('.qty-control-slim button').last().click();
    await expect(qaPage.locator('.qty-control-slim span')).toHaveText('2');

    await qaPage.locator('.btn-close-minimal').click();
    await expect(qaPage.locator('.modal-content-slim')).toBeHidden();
  });
});
