const fs = require('fs');
const path = require('path');

const firebaseJson = process.env['FIREBASE_JSON'];
const stripeKey = process.env['STRIPE_PUBLISHABLE_KEY'];

if (!firebaseJson) {
  console.error('ERROR: La variable de entorno FIREBASE_JSON no está definida.');
  process.exit(1);
}

if (!stripeKey) {
  console.error('ERROR: La variable de entorno STRIPE_PUBLISHABLE_KEY no está definida.');
  process.exit(1);
}

let firebase;
try {
  firebase = JSON.parse(firebaseJson);
} catch (e) {
  console.error('ERROR: FIREBASE_JSON no es un JSON válido.');
  process.exit(1);
}

const content = `export const environment = {
  apiUrl: 'https://illo-uncamperobackend.onrender.com/api',
  siteUrl: 'https://illo-uncampero.web.app',
  stripePublishableKey: '${stripeKey}',
  firebase: ${JSON.stringify(firebase, null, 2)}
};
`;

const outputPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(outputPath, content);
console.log('environment.prod.ts generado correctamente.');
