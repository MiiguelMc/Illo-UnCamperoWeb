# 🍔 Illo-UnCampero

> "Illo, ¿nos pedimos un campero?" — La web definitiva para pedir tus camperos malagueños online.

**Illo-UnCampero** es una plataforma Full-Stack diseñada para digitalizar la experiencia de las hamburgueserías de barrio. Desde el clásico campero de jamón y queso hasta el de pollo con extra de alioli, nuestra misión es que nunca te falte un mollete antequerano bien planchado en tu mesa.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_+_Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Pagos-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ Características

*   **🥖 Carta Digital:** Explora todos los camperos (pollo, atún, tortilla...) con fotos reales y precios actualizados.
*   **🎨 ¡A tu gusto!:** Personaliza cada pedido. ¿Sin cebolla? ¿Doble de queso? Tú mandas.
*   **💳 Pago real:** Tarjeta con Stripe o efectivo, con cupones de descuento validados en el backend.
*   **⚡ Seguimiento en vivo:** Sigue el estado de tu pedido (cocinando → reparto → entregado) y recibe una notificación push en cada cambio.
*   **🔐 Acceso "Illo":** Registro e inicio de sesión con Supabase Auth y roles (CLIENTE / COCINA / ADMIN).
*   **👨‍🍳 Panel de Comandancia:** Dashboard de cocina y gestión de productos para el restaurante desde el backend en Spring Boot.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** Angular 20 (standalone components + signals), i18n ES/EN con ngx-translate. Desplegado en **Vercel**.
*   **Backend:** Spring Boot 3.4 (Java 21) para la lógica de negocio, transacciones y validación. Desplegado en **Render**.
*   **Base de Datos:** **Supabase (PostgreSQL)** — modelo relacional, accedido a través de la API REST del backend.
*   **Autenticación:** **Supabase Auth**, con validación del JWT en el backend.
*   **Pagos:** **Stripe**.
*   **Notificaciones:** **Web Push (VAPID)**.
*   **Almacenamiento de imágenes:** **Cloudinary**.

> Este repo contiene el **frontend** (Angular). El backend vive en un repo aparte
> (`Illo-UnCamperoBackend`).

---

## 🚀 Puesta en marcha (desarrollo)

### Requisitos previos
*   Node.js 20+ y npm
*   Angular CLI 20

### Arranque

```bash
cd illo-un-campero-web
npm install
ng serve
```

La app arranca en `http://localhost:4200`.

### Variables de entorno

En producción, `environment.prod.ts` se genera durante el build con `set-env.js` a partir
de variables de entorno (`STRIPE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`API_URL`, `SITE_URL`). En local puedes editar `src/environments/environment.ts`.

Detalles completos del frontend en [`illo-un-campero-web/README.md`](illo-un-campero-web/README.md)
y la guía de despliegue en `MIGRACION-SUPABASE.md` (repo del backend).
