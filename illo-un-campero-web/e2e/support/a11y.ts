import { expect, type Page } from '@playwright/test';

export async function expectBasicAccessibility(page: Page) {
  await expect(page.locator('h1')).toHaveCount(1);

  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt, 'Todas las imagenes deben tener alt').toBe(0);

  const emptyButtons = await page
    .locator('button')
    .evaluateAll((buttons) =>
      buttons.filter((button) => {
        const hasText = (button.textContent || '').trim().length > 0;
        const hasAria = !!button.getAttribute('aria-label');
        const hasTitle = !!button.getAttribute('title');
        return !hasText && !hasAria && !hasTitle;
      }).length,
    );
  expect(emptyButtons, 'Todos los botones deben tener nombre accesible').toBe(0);

  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicateIds, 'No debe haber IDs duplicados').toEqual([]);
}
