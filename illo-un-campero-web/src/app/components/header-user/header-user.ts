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
  isMenuOpen = false;
  menuMovilAbierto = false;

  private usuarioActual: any = null;

  constructor() {
    this.user$.subscribe(user => this.usuarioActual = user);
  }

  esAdmin(): boolean {
    return this.usuarioActual?.rol?.toUpperCase() === 'ADMIN';
  }

  getInicial(): string {
    const nombre = this.usuarioActual?.nombre || '';
    return nombre.charAt(0).toUpperCase() || 'U';
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleMobileMenu() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
    document.body.style.overflow = this.menuMovilAbierto ? 'hidden' : 'auto';
  }

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
