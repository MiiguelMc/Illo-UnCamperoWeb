import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; // <--- Añadimos Router
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header-user.html',
  styleUrl: './header-user.css'
})
export class HeaderUserComponent {
  private authService = inject(AuthService);
  public router = inject(Router); // <--- Inyectamos el Router
  carritoService = inject(CarritoService);

  user$ = this.authService.user$;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}