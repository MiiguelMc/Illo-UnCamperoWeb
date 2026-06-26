import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const siteUrl = 'https://illouncampero.vercel.app';
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { path: '/restaurantes', changefreq: 'weekly', priority: '1.0' },
  { path: '/carta', changefreq: 'daily', priority: '0.9' },
  { path: '/contacto', changefreq: 'monthly', priority: '0.5' },
  { path: '/aviso-legal', changefreq: 'yearly', priority: '0.2' },
  { path: '/privacidad', changefreq: 'yearly', priority: '0.2' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl}${url.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

mkdirSync(join(root, 'src'), { recursive: true });
writeFileSync(join(root, 'src', 'sitemap.xml'), xml, 'utf8');
