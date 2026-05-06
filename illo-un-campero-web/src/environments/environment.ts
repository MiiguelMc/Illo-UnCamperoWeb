// la pusimos asi porque render nos da una url fija, si cambias el deploy actualiza esto
export const environment = {
  apiUrl: 'https://illo-uncamperobackend.onrender.com/api',
  // Stripe - Reemplaza con tu clave publica de test (empieza por pk_test_)
  // Consiguela en: https://dashboard.stripe.com/test/apikeys
  stripePublishableKey: 'pk_test_51TNry3BCLmntR5kviEvyUfcAWWBh8ZAuLIOtoRhZNiPJbmUupsfPdcoDPauHB6Dtm7nFk8wwmlSd79iiugktDR9500AV69yRGO',
  // Cloudinary - solo el cloud name es público, el resto va en variables de entorno del backend
  // Consíguelo en: https://console.cloudinary.com → Dashboard → Cloud Name
  cloudinaryCloudName: 'SUSTITUIR_CLOUD_NAME',
};
