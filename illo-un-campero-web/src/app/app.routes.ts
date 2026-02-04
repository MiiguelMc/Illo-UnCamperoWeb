import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RestauranteComponent } from './components/restaurantes/restaurantes'; 
import { RegistroComponent } from './components/registro/registro'; 
import { PerfilComponent } from './components/perfil/perfil';
// Importamos el nuevo componente de la Carta
import { CartaComponent } from './components/carta/carta'; 

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'restaurantes', component: RestauranteComponent },
    { path: 'registro', component: RegistroComponent }, 
    { path: 'perfil', component: PerfilComponent },
    { path: 'carta', component: CartaComponent }, // <--- Añadimos la ruta de la carta
    { path: '', redirectTo: 'restaurantes', pathMatch: 'full' },
    { path: '**', redirectTo: 'restaurantes' }
];