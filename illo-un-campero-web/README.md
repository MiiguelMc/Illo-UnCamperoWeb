# Illo Un Campero — Web

Aplicación web para realizar pedidos online en una hamburguesería malagueña. Desarrollada como parte de un TFG con Angular 20.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
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
- Dashboard de cocina con actualizaciones en tiempo real (Firestore)
- Panel de gestión de productos para administradores (CRUD completo)
- Autenticación con Firebase Auth y verificación de email
- Roles: CLIENTE, ADMIN, COCINA
- Cupones de descuento con validación en backend
- Internacionalización ES / EN con ngx-translate

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 20 (standalone components + signals) |
| Base de datos | Firebase Firestore (tiempo real con AngularFire) |
| Autenticación | Firebase Auth |
| Pagos | Stripe (confirmCardPayment) |
| Notificaciones | FCM |
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

En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  stripe: {
    publicKey: 'pk_test_...'
  }
};
```

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

Los artefactos quedan en `dist/`. Desplegado en Firebase Hosting.
