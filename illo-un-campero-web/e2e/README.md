# Suite E2E Playwright - Illo Un Campero

## Instalacion

```bash
npm install
npm run e2e:install
```

## Ejecucion

```bash
npm run e2e
npm run e2e:headed
npm run e2e:ui
npm run e2e:report
```

Por defecto los tests apuntan a produccion:

```bash
https://illo-uncampero.web.app
```

Para probar local:

```bash
npm start
$env:E2E_BASE_URL="http://localhost:4200"; npm run e2e
```

## Estructura

- `specs/`: tests organizados por funcionalidad.
- `fixtures/qa-test.ts`: captura errores de consola, errores JS, peticiones fallidas y respuestas 4xx/5xx.
- `support/a11y.ts`: checks basicos de accesibilidad.
- `support/performance.ts`: checks basicos de FCP, load, CLS y LCP.
- `support/selectors.ts`: utilidades comunes de navegacion y UI.

## Artefactos automaticos

Playwright guarda en fallos:

- screenshot
- video
- trace
- HTML report
- JUnit XML para CI
