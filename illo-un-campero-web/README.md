# Illo Un Campero — Web

Aplicación web para realizar pedidos online en una hamburguesería malagueña. Desarrollada como parte de un TFG con Angular 20.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Pagos-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

---

## Características

- Carta digital con productos organizados por categorías y subcategorías
- Carrito de compra persistente en localStorage
- Confirmación de pedido con selección de método de pago (tarjeta o efectivo)
- Pago con tarjeta vía Stripe
- Seguimiento de pedidos en tiempo real con estados actualizados
- Valoración de pedidos una vez entregados
- Historial de pedidos del usuario
- Dashboard de cocina con actualizaciones periódicas (polling al backend)
- Panel de gestión de productos para administradores (CRUD completo)
- Autenticación con Supabase Auth
- Notificaciones push con Web Push (VAPID)
- Roles: CLIENTE, ADMIN, COCINA
- Cupones de descuento con validación en backend
- Internacionalización ES / EN con ngx-translate

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 20 (standalone components + signals) |
| Datos | API REST del backend (Spring + Supabase Postgres) |
| Autenticación | Supabase Auth (@supabase/supabase-js) |
| Pagos | Stripe (confirmCardPayment) |
| Notificaciones | Web Push (VAPID) |
| i18n | ngx-translate |
| HTTP | Angular HttpClient con interceptor de autenticación |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── carta/                  # Carta de productos
│   │   ├── carrito/                # Carrito de compra
│   │   ├── confirmar-pedido/       # Selección de método de pago
│   │   ├── pedido-exitoso/         # Confirmación tras pagar
│   │   ├── mis-pedidos/            # Historial del usuario
│   │   ├── seguimiento/            # Seguimiento en tiempo real
│   │   ├── cocina-dashboard/       # Dashboard de cocina (rol COCINA/ADMIN)
│   │   ├── gestion-productos/      # CRUD de productos (rol ADMIN)
│   │   ├── perfil/                 # Datos del usuario
│   │   ├── header-login/           # Header para usuarios no autenticados
│   │   ├── header-user/            # Header para usuarios autenticados
│   │   ├── producto-item/          # Tarjeta de producto reutilizable
│   │   ├── pedido-card-cocina/     # Tarjeta de pedido en cocina
│   │   ├── restaurantes/           # Página de inicio
│   │   ├── login/                  # Login
│   │   └── registro/               # Registro
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── carrito.service.ts
│   │   ├── cupon.service.ts
│   │   ├── pago.service.ts
│   │   ├── pedido.service.ts
│   │   ├── producto.service.ts
│   │   ├── resena.service.ts
│   │   ├── restaurante.service.ts
│   │   └── tienda.service.ts
│   ├── guards/
│   │   └── admin.guard.ts          # Protege rutas ADMIN y COCINA
│   └── interceptors/
│       └── auth.interceptor.ts     # Añade Bearer token automáticamente
├── model/                          # Interfaces TypeScript
└── assets/
    └── i18n/                       # Traducciones es.json / en.json
```

---

## Instalación

### Requisitos
- Node.js 20+
- Angular CLI 20

```bash
npm install
ng serve
```

La app arranca en `http://localhost:4200`.

### Variables de entorno

En producción, `environment.prod.ts` se genera en el build con `set-env.js` a partir de
estas variables de entorno (en local puedes editar `src/environments/environment.ts`):

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=...
API_URL=https://illo-uncamperobackend.onrender.com/api   # opcional
SITE_URL=https://<tu-app>.vercel.app                      # opcional
```

Ver `MIGRACION-SUPABASE.md` (repo del backend) para el despliegue completo.

---

## Rutas principales

| Ruta | Acceso | Descripción |
|---|---|---|
| `/restaurantes` | Público | Inicio |
| `/carta` | Público | Carta de productos |
| `/carrito` | Autenticado | Carrito de compra |
| `/confirmar-pedido` | Autenticado | Selección de método de pago |
| `/pedido-exitoso` | Autenticado | Confirmación de pedido |
| `/mis-pedidos` | Autenticado | Historial de pedidos |
| `/seguimiento/:id` | Autenticado | Seguimiento en tiempo real |
| `/valorar/:id` | Autenticado | Valorar pedido entregado |
| `/perfil` | Autenticado | Datos del usuario |
| `/cocina` | ADMIN / COCINA | Dashboard de cocina en tiempo real |
| `/gestion-productos` | ADMIN | CRUD de productos |

---

## Build producción

```bash
ng build
```

Los artefactos quedan en `dist/illo-un-campero-web/browser`. Desplegado en Vercel (ver `vercel.json`).
