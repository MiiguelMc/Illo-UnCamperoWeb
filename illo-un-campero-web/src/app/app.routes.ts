import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RestaurantesComponent } from './components/restaurantes/restaurantes'; 
import { RegistroComponent } from './components/registro/registro'; // Importalo
// He quitado el .component porque tu archivo no lo tiene

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'restaurantes', component: RestaurantesComponent },
    { path: 'registro', component: RegistroComponent }, // Esta es la nueva
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];