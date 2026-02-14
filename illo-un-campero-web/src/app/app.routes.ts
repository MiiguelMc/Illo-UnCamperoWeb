import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RestauranteComponent } from './components/restaurantes/restaurantes'; 
import { RegistroComponent } from './components/registro/registro'; 
import { PerfilComponent } from './components/perfil/perfil';
import { CartaComponent } from './components/carta/carta'; 
import { CarritoComponent } from './components/carrito/carrito';
import { ConfirmarPedidoComponent } from './components/confirmar-pedido/confirmar-pedido';
import { PedidoExitosoComponent } from './components/pedido-exitoso/pedido-exitoso';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos';
import { CocinaDashboardComponent } from './components/cocina-dashboard/cocina-dashboard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'restaurantes', component: RestauranteComponent },
    { path: 'carrito', component: CarritoComponent },
    { path: 'registro', component: RegistroComponent }, 
    { path: 'perfil', component: PerfilComponent },
    { path: 'carta', component: CartaComponent },
    { path: 'confirmar-pedido', component: ConfirmarPedidoComponent },
    { path: 'pedido-exitoso', component: PedidoExitosoComponent },
    { path: 'mis-pedidos', component: MisPedidosComponent },
    { path: 'cocina', component: CocinaDashboardComponent },
    { path: '', redirectTo: 'restaurantes', pathMatch: 'full' },
    { path: '**', redirectTo: 'restaurantes' }
];