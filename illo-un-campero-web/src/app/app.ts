import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

// IMPORTACIÓN DE TUS COMPONENTES
// Asegúrate de que los archivos existan en estas rutas
import { Header } from './components/header-login/header'; 
import { HeaderUserComponent } from './components/header-user/header-user';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,        // Necesario para que funcione el pipe | async en el HTML
    RouterOutlet,        // Necesario para que funcionen las rutas (login, registro...)
    Header,              // Componente del header de invitado
    HeaderUserComponent, // Componente del header de usuario logueado
    Footer               // Componente del footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // Usamos inject para traer el servicio de autenticación
  private authService = inject(AuthService);
  
  // Esta variable user$ es la que "escucha" a Firebase.
  // En el app.html, el pipe | async se suscribirá automáticamente.
  user$ = this.authService.user$; 
}