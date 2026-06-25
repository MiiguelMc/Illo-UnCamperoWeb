import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TiendaService } from './services/tienda.service';
import { Header } from './components/header-login/header';
import { HeaderUserComponent } from './components/header-user/header-user';
import { Footer } from './components/footer/footer';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './services/seo.service';
import { WarmupService } from './services/warmup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, HeaderUserComponent, Footer, CookieBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private tiendaService = inject(TiendaService);
  private translate = inject(TranslateService);
  private seo = inject(SeoService);
  private warmup = inject(WarmupService);

  user$ = this.authService.user$;
  authInitialized = false;
  despertando = this.warmup.despertando;

  constructor() {
    // Marcar como inicializado en cuanto Firebase resuelve el estado de auth (sin esperar al backend)
    this.authService.authReady$.subscribe(() => {
      this.authInitialized = true;
    });
  }

  ngOnInit() {
    this.seo.init();
    this.warmup.despertar();
    this.tiendaService.cargarEstado();
    // Inicializar traducción
    this.translate.setDefaultLang('es');
    const savedLang = localStorage.getItem('illo_idioma') || 'es';
    this.translate.use(savedLang);
  }
}
