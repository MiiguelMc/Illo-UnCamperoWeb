import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TiendaService {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private API_URL = 'https://illo-uncamperobackend.onrender.com/api/tienda';

  tiendaAbierta = signal<boolean>(true);
  cargando = signal<boolean>(true);

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No autenticado');
    const token = await user.getIdToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

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

  cambiarEstado(abierta: boolean) {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers =>
        this.http.patch<{ abierta: boolean }>(
          `${this.API_URL}/estado`,
          { abierta },
          { headers }
        )
      )
    );
  }
}
