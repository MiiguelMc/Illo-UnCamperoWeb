import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el pipe async y ngIf
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-user',
  standalone: true,
  // IMPORTANTE: Tienes que importar CommonModule para que el HTML entienda el pipe async
  imports: [CommonModule, RouterLink], 
  templateUrl: './header-user.html',
  styleUrl: './header-user.css'
})
export class HeaderUserComponent {
  // 1. Inyectamos el servicio
  private authService = inject(AuthService);

  // 2. Creamos la propiedad user$ que el HTML está buscando
  user$ = this.authService.user$;

  // 3. Estado para el menú desplegable (que también lo usas en el HTML)
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}