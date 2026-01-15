import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // IMPORTANTE: Hay que importar esto
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // AÑADE RouterOutlet AQUÍ
  template: `
    <!-- Aquí puedes poner tu Navbar más adelante -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent { // La llamamos AppComponent (con "Component" al final)
  public auth = inject(AuthService);
}