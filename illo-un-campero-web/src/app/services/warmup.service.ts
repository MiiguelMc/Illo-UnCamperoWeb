import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, timer } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Despierta el backend al arrancar la app.
 *
 * El backend está en el plan free de Render, que duerme el servicio tras ~15 min
 * sin tráfico. La primera petición tras el reposo tarda ~50s (cold start). Este
 * servicio lanza un ping a /api/health al cargar la web y, si tarda en responder,
 * muestra el aviso "encendiendo la plancha" para que no parezca que está roto.
 */
@Injectable({ providedIn: 'root' })
export class WarmupService {
  private http = inject(HttpClient);
  private readonly HEALTH_URL = `${environment.apiUrl}/health`;

  /** true mientras el backend está frío y tarda en responder. */
  readonly despertando = signal(false);

  despertar() {
    // Si en 2,5s no ha respondido, asumimos cold start y avisamos al usuario.
    const avisoTimer = setTimeout(() => this.despertando.set(true), 2500);

    this.http
      .get(this.HEALTH_URL, { responseType: 'text' })
      .pipe(
        // Render puede devolver 502/503 mientras arranca: reintentamos con espera.
        retry({ count: 5, delay: () => timer(3000) }),
      )
      .subscribe({
        next: () => {
          clearTimeout(avisoTimer);
          this.despertando.set(false);
        },
        error: () => {
          clearTimeout(avisoTimer);
          this.despertando.set(false);
        },
      });
  }
}
