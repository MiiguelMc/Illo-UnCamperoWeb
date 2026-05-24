import { test as base, expect, type Page, type TestInfo } from '@playwright/test';

type QaFixtures = {
  qaPage: Page;
};

const ignoredConsolePatterns = [
  /ResizeObserver loop/i,
  /google maps/i,
];

const ignoredRequestHosts = [
  'google.com',
  'gstatic.com',
  'googleapis.com',
  'firebaseinstallations.googleapis.com',
  'js.stripe.com',
];

async function attachDiagnostics(page: Page, testInfo: TestInfo) {
  await testInfo.attach('current-url', {
    body: page.url(),
    contentType: 'text/plain',
  });

  await testInfo.attach('page-html', {
    body: await page.locator('body').evaluate((body) => body.innerHTML).catch(() => ''),
    contentType: 'text/html',
  });
}

export const test = base.extend<QaFixtures>({
  qaPage: async ({ page }, use, testInfo) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];
    const badResponses: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !ignoredConsolePatterns.some((pattern) => pattern.test(text))) {
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      const hostIgnored = ignoredRequestHosts.some((host) => url.includes(host));
      const errorText = request.failure()?.errorText || 'unknown';

      // Playwright cancela recursos en vuelo al cambiar de ruta; eso no equivale a asset roto.
      if (!hostIgnored && !errorText.includes('ERR_ABORTED')) {
        failedRequests.push(`${request.method()} ${url} - ${errorText}`);
      }
    });

    page.on('response', (response) => {
      const status = response.status();
      const url = response.url();
      const isFirstParty = url.startsWith(testInfo.project.use.baseURL as string);
      const isApi = url.includes('illo-uncamperobackend.onrender.com');
      const isAsset = isFirstParty && /\.(js|css|png|jpe?g|webp|svg|ico|json)(\?|$)/i.test(url);

      if ((isFirstParty || isApi || isAsset) && status >= 400) {
        badResponses.push(`${status} ${url}`);
      }
    });

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      await attachDiagnostics(page, testInfo);
    }

    expect.soft(pageErrors, 'No debe haber errores JavaScript no capturados').toEqual([]);
    expect.soft(consoleErrors, 'No debe haber errores de consola').toEqual([]);
    expect.soft(failedRequests, 'No debe haber peticiones first-party fallidas').toEqual([]);
    expect.soft(badResponses, 'No debe haber respuestas 4xx/5xx first-party o API').toEqual([]);
  },
});

export { expect };
