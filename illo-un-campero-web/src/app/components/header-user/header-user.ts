import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router';
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
  public router = inject(Router);
  private eRef = inject(ElementRef);
  carritoService = inject(CarritoService);

  user$ = this.authService.user$;
  isMenuOpen = false; // Dropdown PC
  menuMovilAbierto = false; // Menú Celular

  // PC: Dropdown de Perfil
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  // MÓVIL: Hamburguesa Full Screen
  toggleMobileMenu() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
    // Bloqueamos el scroll pa' que el cliente no se pierda
    document.body.style.overflow = this.menuMovilAbierto ? 'hidden' : 'auto';
  }

  // Cierra el perfil si pinchas en la calle
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.isMenuOpen = false;
    this.menuMovilAbierto = false;
    document.body.style.overflow = 'auto';
    this.authService.logout();
  }
}