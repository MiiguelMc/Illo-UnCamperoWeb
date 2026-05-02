import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RestaurantesComponent } from './components/restaurantes/restaurantes';
import { RegistroComponent } from './components/registro/registro';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'restaurantes', component: RestaurantesComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'restaurantes', pathMatch: 'full' },
    { path: '**', redirectTo: 'restaurantes' }
];