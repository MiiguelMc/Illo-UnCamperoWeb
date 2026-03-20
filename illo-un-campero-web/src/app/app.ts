import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TiendaService } from './services/tienda.service';
import { Header } from './components/header-login/header';
import { HeaderUserComponent } from './components/header-user/header-user';
import { Footer } from './components/footer/footer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, HeaderUserComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private tiendaService = inject(TiendaService);
  private translate = inject(TranslateService);

  user$ = this.authService.user$;
  authInitialized = false;

  constructor() {
    this.user$.subscribe(() => {
      this.authInitialized = true;
    });
  }

  ngOnInit() {
    this.tiendaService.cargarEstado();
    // Inicializar traducción
    this.translate.setDefaultLang('es');
    const savedLang = localStorage.getItem('illo_idioma') || 'es';
    this.translate.use(savedLang);
  }
}
