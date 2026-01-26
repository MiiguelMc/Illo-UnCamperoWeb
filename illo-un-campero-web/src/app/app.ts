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
// app.component.ts
export class AppComponent {
  private authService = inject(AuthService);
  user$ = this.authService.user$;
  
  // Opcional: Para evitar parpadeos visuales
  authInitialized = false;

  constructor() {
    this.user$.subscribe(() => {
      this.authInitialized = true;
    });
  }
}