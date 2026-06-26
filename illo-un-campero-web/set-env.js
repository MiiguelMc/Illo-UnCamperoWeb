const fs = require('fs');
const path = require('path');

const stripeKey = process.env['STRIPE_PUBLISHABLE_KEY'];
const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];

// Permiten sobreescribir las URLs en el deploy (Vercel/Render) sin tocar el codigo.
const apiUrl = process.env['API_URL'] || 'https://illo-uncamperobackend.onrender.com/api';
const siteUrl = process.env['SITE_URL'] || 'https://illouncampero.vercel.app';

if (!stripeKey) {
  console.error('ERROR: La variable de entorno STRIPE_PUBLISHABLE_KEY no está definida.');
  process.exit(1);
}
if (!supabaseUrl) {
  console.error('ERROR: La variable de entorno SUPABASE_URL no está definida.');
  process.exit(1);
}
if (!supabaseAnonKey) {
  console.error('ERROR: La variable de entorno SUPABASE_ANON_KEY no está definida.');
  process.exit(1);
}

const content = `export const environment = {
  apiUrl: ${JSON.stringify(apiUrl)},
  siteUrl: ${JSON.stringify(siteUrl)},
  stripePublishableKey: ${JSON.stringify(stripeKey)},
  supabaseUrl: ${JSON.stringify(supabaseUrl)},
  supabaseAnonKey: ${JSON.stringify(supabaseAnonKey)},
};
`;

const outputPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(outputPath, content);
console.log('environment.prod.ts generado correctamente.');
