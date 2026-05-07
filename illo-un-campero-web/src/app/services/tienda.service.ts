import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TiendaService {
  private http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/tienda`;

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

  cambiarEstado(abierta: boolean): Observable<{ abierta: boolean }> {
    return this.http.patch<{ abierta: boolean }>(`${this.API_URL}/estado`, { abierta });
  }
}
