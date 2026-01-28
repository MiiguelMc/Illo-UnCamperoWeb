import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RestauranteComponent } from './components/restaurantes/restaurantes'; 
import { RegistroComponent } from './components/registro/registro'; // Importalo
import { PerfilComponent } from './components/perfil/perfil';
// He quitado el .component porque tu archivo no lo tiene

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'restaurantes', component: RestauranteComponent },
    { path: 'registro', component: RegistroComponent }, // Esta es la nueva
    { path: 'perfil', component: PerfilComponent },
    { path: '', redirectTo: 'restaurantes', pathMatch: 'full' },
    { path: '**', redirectTo: 'restaurantes' }
];