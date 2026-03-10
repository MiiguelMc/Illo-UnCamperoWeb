import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const STORAGE_KEY = 'restaurante_abierto';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private auth = inject(Auth);
  private http = inject(HttpClient);

  private API_URL = 'https://illo-uncamperobackend.onrender.com/api';

  // Estado reactivo del restaurante. Por defecto abierto.
  // Se lee de localStorage para persistir entre recargas.
  abierto = signal<boolean>(this.leerEstadoLocal());

  private leerEstadoLocal(): boolean {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado === null ? true : guardado === 'true';
    } catch {
      return true;
    }
  }

  setAbierto(valor: boolean) {
    this.abierto.set(valor);
    try {
      localStorage.setItem(STORAGE_KEY, String(valor));
    } catch {}
  }

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No autenticado');
    const token = await user.getIdToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' });
  }

  obtenerEstadisticasHoy() {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers =>
        this.http.get<{ totalDinero: number; totalPedidos: number }>(
          `${this.API_URL}/pedidos/estadisticas/hoy`, { headers }
        )
      )
    );
  }
}
