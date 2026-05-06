import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const COOKIE_KEY = 'illo_cookies_aceptadas';

@Component({
    selector: 'app-cookie-banner',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cookie-banner.html',
    styleUrls: ['./cookie-banner.css']
})
export class CookieBannerComponent {
    visible = signal(!localStorage.getItem(COOKIE_KEY));

    aceptar() {
        localStorage.setItem(COOKIE_KEY, '1');
        this.visible.set(false);
    }
}
