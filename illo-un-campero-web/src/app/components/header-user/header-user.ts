import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; // <--- CAMBIO: Importamos RouterModule completo
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-user',
  standalone: true,
  // Añadimos RouterModule aquí para que reconozca routerLinkActive y routerLinkActiveOptions
  imports: [CommonModule, RouterModule], 
  templateUrl: './header-user.html',
  styleUrl: './header-user.css'
})
export class HeaderUserComponent {
  private authService = inject(AuthService);

  user$ = this.authService.user$;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}