import { expect, type Page } from '@playwright/test';

export async function expectBasicPerformance(page: Page) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')?.startTime ?? 0;

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      load: navigation.loadEventEnd - navigation.startTime,
      transferSize: navigation.transferSize,
      fcp,
    };
  });

  expect(metrics.domContentLoaded, 'DOMContentLoaded debe ser razonable').toBeLessThan(4_000);
  expect(metrics.load, 'Load event debe ser razonable').toBeLessThan(8_000);
  expect(metrics.fcp, 'First Contentful Paint debe ser razonable').toBeLessThan(3_500);
}

export async function expectWebVitals(page: Page) {
  const vitals = await page.evaluate(async () => {
    const cls = await new Promise<number>((resolve) => {
      let value = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) value += entry.value;
        }
      });

      try {
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(value);
        }, 1_000);
      } catch {
        resolve(0);
      }
    });

    const lcp = await new Promise<number>((resolve) => {
      let value = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        value = lastEntry?.startTime ?? value;
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(value);
        }, 1_000);
      } catch {
        resolve(0);
      }
    });

    return { cls, lcp };
  });

  expect(vitals.cls, 'CLS debe mantenerse estable').toBeLessThan(0.1);
  expect(vitals.lcp, 'LCP debe ser aceptable para una landing').toBeLessThan(4_000);
}
