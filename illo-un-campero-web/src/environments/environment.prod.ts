// Sustituye los valores SUSTITUIR_* antes de hacer deploy a producción
export const environment = {
  apiUrl: 'https://illo-uncamperobackend.onrender.com/api',
  // Stripe: consigue la clave live en https://dashboard.stripe.com/apikeys
  stripePublishableKey: 'pk_live_SUSTITUIR_POR_CLAVE_REAL',
  // Cloudinary - solo el cloud name es público, el resto va en variables de entorno del backend
  cloudinaryCloudName: 'SUSTITUIR_CLOUD_NAME',
};
