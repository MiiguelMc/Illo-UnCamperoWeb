import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'restaurante_abierto';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

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

  obtenerEstadisticasHoy(): Observable<{ totalDinero: number; totalPedidos: number }> {
    return this.http.get<{ totalDinero: number; totalPedidos: number }>(
      `${this.API_URL}/pedidos/estadisticas/hoy`
    );
  }
}
