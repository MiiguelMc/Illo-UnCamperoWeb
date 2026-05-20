import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TiendaService implements OnDestroy {
  private http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/tienda`;
  private pollSub?: Subscription;

  tiendaAbierta = signal<boolean>(true);
  cargando = signal<boolean>(true);

  cargarEstado() {
    this.http.get<{ abierta: boolean }>(`${this.API_URL}/estado`).subscribe({
      next: (res) => {
        this.tiendaAbierta.set(res.abierta);
        this.cargando.set(false);
      },
      error: () => {
        this.tiendaAbierta.set(true);
        this.cargando.set(false);
      }
    });
  }

  /** Inicia polling cada 60s para mantener el estado sincronizado */
  iniciarPolling() {
    this.detenerPolling();
    this.pollSub = interval(60000).subscribe(() => this.cargarEstado());
  }

  detenerPolling() {
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
  }

  cambiarEstado(abierta: boolean): Observable<{ abierta: boolean }> {
    return this.http.patch<{ abierta: boolean }>(`${this.API_URL}/estado`, { abierta });
  }

  ngOnDestroy() {
    this.detenerPolling();
  }
}
