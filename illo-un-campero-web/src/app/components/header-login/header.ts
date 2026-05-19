import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  public router = inject(Router);
  translate = inject(TranslateService);
  menuMovilAbierto = false;
  isDarkMode = false;

  get idiomaActual() { return this.translate.currentLang || 'es'; }

  constructor() {
    this.isDarkMode = localStorage.getItem('illo_theme') === 'dark';
    this.applyTheme();
  }

  cambiarIdioma() {
    const nuevo = this.idiomaActual === 'es' ? 'en' : 'es';
    this.translate.use(nuevo);
    localStorage.setItem('illo_idioma', nuevo);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('illo_theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleMenu() { this.menuMovilAbierto = !this.menuMovilAbierto; }

  comprobarPedido() {
    this.menuMovilAbierto = false;
    const esEs = this.idiomaActual === 'es';
    Swal.fire({
      title: esEs ? '¡Epa, primo!' : 'Hold on!',
      text: esEs
        ? 'Para poder ver tu pedido tienes que registrarte primero.'
        : 'You need to sign up first to see your order.',
      icon: 'info', iconColor: '#f39200', showCancelButton: true,
      confirmButtonText: esEs ? '¡Me registro!' : 'Sign me up!',
      cancelButtonText: esEs ? 'Luego lo hago' : 'Maybe later',
      confirmButtonColor: '#f39200', cancelButtonColor: '#0d1117', heightAuto: false,
    }).then(r => { if (r.isConfirmed) this.router.navigate(['/registro']); });
  }
}
