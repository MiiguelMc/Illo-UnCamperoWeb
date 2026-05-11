import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
    data: {
      seo: {
        title: 'Iniciar sesión | Illo Un Campero',
        description:
          'Entra en tu cuenta de Illo Un Campero para pedir camperos en Teatinos y consultar tus pedidos.',
        path: '/login',
        robots: 'noindex, follow',
      },
    },
  },
  {
    path: 'restaurantes',
    loadComponent: () =>
      import('./components/restaurantes/restaurantes').then((m) => m.RestauranteComponent),
    data: {
      seo: {
        title: 'Illo Un Campero | Camperos malagueños a domicilio en Teatinos',
        description:
          'Camperos malagueños recién hechos en Teatinos, Málaga. Pide online en Illo Un Campero, consulta ofertas y recibe tu pedido rápido.',
        path: '/restaurantes',
      },
    },
  },
  {
    path: 'carrito',
    loadComponent: () => import('./components/carrito/carrito').then((m) => m.CarritoComponent),
    data: {
      seo: {
        title: 'Tu pedido | Illo Un Campero',
        description:
          'Revisa tu carrito y confirma tu pedido de camperos, entrantes, bebidas y postres.',
        path: '/carrito',
        robots: 'noindex, follow',
      },
    },
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro').then((m) => m.RegistroComponent),
    data: {
      seo: {
        title: 'Crear cuenta | Illo Un Campero',
        description:
          'Crea tu cuenta para pedir camperos a domicilio en Teatinos y guardar tus datos de entrega.',
        path: '/registro',
        robots: 'noindex, follow',
      },
    },
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil').then((m) => m.PerfilComponent),
    data: {
      seo: {
        title: 'Mi perfil | Illo Un Campero',
        description: 'Gestiona tus datos personales y direcciones de entrega en Illo Un Campero.',
        path: '/perfil',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'carta',
    loadComponent: () => import('./components/carta/carta').then((m) => m.CartaComponent),
    data: {
      seo: {
        title: 'Carta de camperos en Teatinos | Illo Un Campero',
        description:
          'Consulta la carta de Illo Un Campero: camperos malagueños, entrantes, patatas, bebidas y postres para pedir online en Teatinos.',
        path: '/carta',
        keywords:
          'carta camperos Teatinos, camperos Málaga, entrantes a domicilio, pedir campero online, Illo Un Campero carta',
      },
    },
  },
  {
    path: 'confirmar-pedido',
    loadComponent: () =>
      import('./components/confirmar-pedido/confirmar-pedido').then(
        (m) => m.ConfirmarPedidoComponent,
      ),
    data: {
      seo: {
        title: 'Confirmar pedido | Illo Un Campero',
        description: 'Confirma los datos de entrega y pago de tu pedido en Illo Un Campero.',
        path: '/confirmar-pedido',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'pedido-exitoso',
    loadComponent: () =>
      import('./components/pedido-exitoso/pedido-exitoso').then((m) => m.PedidoExitosoComponent),
    data: {
      seo: {
        title: 'Pedido confirmado | Illo Un Campero',
        description: 'Tu pedido en Illo Un Campero se ha confirmado correctamente.',
        path: '/pedido-exitoso',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'mis-pedidos',
    loadComponent: () =>
      import('./components/mis-pedidos/mis-pedidos').then((m) => m.MisPedidosComponent),
    data: {
      seo: {
        title: 'Mis pedidos | Illo Un Campero',
        description: 'Consulta tu historial de pedidos y repite tus camperos favoritos.',
        path: '/mis-pedidos',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'seguimiento/:id',
    loadComponent: () =>
      import('./components/seguimiento/seguimiento').then((m) => m.SeguimientoComponent),
    data: {
      seo: {
        title: 'Seguimiento del pedido | Illo Un Campero',
        description: 'Consulta el estado de tu pedido en Illo Un Campero.',
        path: '/seguimiento',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'valorar/:id',
    loadComponent: () =>
      import('./components/seguimiento/valorar-pedido').then((m) => m.ValorarPedidoComponent),
    data: {
      seo: {
        title: 'Valorar pedido | Illo Un Campero',
        description: 'Valora tu experiencia con Illo Un Campero.',
        path: '/valorar',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'cocina',
    loadComponent: () =>
      import('./components/cocina-dashboard/cocina-dashboard').then(
        (m) => m.CocinaDashboardComponent,
      ),
    canActivate: [adminGuard],
    data: {
      seo: {
        title: 'Panel de cocina | Illo Un Campero',
        description: 'Panel interno de cocina de Illo Un Campero.',
        path: '/cocina',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'gestion-productos',
    loadComponent: () =>
      import('./components/gestion-productos/gestion-productos').then(
        (m) => m.GestionProductosComponent,
      ),
    canActivate: [adminGuard],
    data: {
      seo: {
        title: 'Gestión de productos | Illo Un Campero',
        description: 'Panel interno de gestión de productos de Illo Un Campero.',
        path: '/gestion-productos',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'privacidad',
    loadComponent: () =>
      import('./components/privacidad/privacidad').then((m) => m.PrivacidadComponent),
    data: {
      seo: {
        title: 'Política de privacidad | Illo Un Campero',
        description:
          'Consulta la política de privacidad, cookies y tratamiento de datos de Illo Un Campero.',
        path: '/privacidad',
        robots: 'index, follow',
      },
    },
  },
  {
    path: 'contacto',
    loadComponent: () => import('./components/contacto/contacto').then((m) => m.ContactoComponent),
    data: {
      seo: {
        title: 'Contacto | Illo Un Campero en Teatinos, Málaga',
        description:
          'Contacta con Illo Un Campero en Teatinos, Málaga. Teléfono, email, horario, dirección y zonas de reparto de camperos a domicilio.',
        path: '/contacto',
        robots: 'index, follow',
        keywords:
          'contacto Illo Un Campero, campero Teatinos teléfono, restaurante Teatinos Málaga, camperos a domicilio Málaga',
      },
    },
  },
  {
    path: 'aviso-legal',
    loadComponent: () =>
      import('./components/aviso-legal/aviso-legal').then((m) => m.AvisoLegalComponent),
    data: {
      seo: {
        title: 'Aviso legal | Illo Un Campero',
        description:
          'Aviso legal de Illo Un Campero: titularidad, datos de contacto, condiciones de uso y responsabilidad del sitio web.',
        path: '/aviso-legal',
        robots: 'index, follow',
      },
    },
  },
  { path: '', redirectTo: 'restaurantes', pathMatch: 'full' },
  { path: '**', redirectTo: 'restaurantes' },
];
