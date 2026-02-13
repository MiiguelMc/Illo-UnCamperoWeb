import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Pedido, CrearPedidoDTO, EstadoPedido } from '../../model/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  // URL de tu backend - AJUSTA SEGÚN TU CONFIGURACIÓN
  private API_URL = 'https://illo-uncamperobackend.onrender.com/api/pedidos';

  /**
   * Método auxiliar para obtener headers con el token de autenticación
   */
  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    
    const token = await user.getIdToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Crear un nuevo pedido
   * @param pedidoDTO - Datos del pedido a crear
   * @returns Observable con el pedido creado
   */
  crearPedido(pedidoDTO: CrearPedidoDTO): Observable<string> {
  return from(this.getAuthHeaders()).pipe(
    switchMap(headers => 
      this.http.post(
        `${this.API_URL}/realizar-pedido`, 
        pedidoDTO, 
        { 
          headers,
          responseType: 'text' // ← ESTO SOLUCIONA EL PROBLEMA
        }
      )
    )
  );
}

  /**
   * Obtener todos los pedidos del usuario autenticado
   * @param uid - UID del usuario
   * @returns Observable con array de pedidos
   */
  obtenerPedidosUsuario(uid: string): Observable<Pedido[]> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => 
        this.http.get<Pedido[]>(`${this.API_URL}/usuario/${uid}`, { headers })
      )
    );
  }

  /**
   * Obtener un pedido específico por ID
   * @param id - ID del pedido
   * @returns Observable con el pedido
   */
  obtenerPedidoPorId(id: string): Observable<Pedido> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => 
        this.http.get<Pedido>(`${this.API_URL}/${id}`, { headers })
      )
    );
  }

  /**
   * Obtener todos los pedidos (SOLO ADMINISTRADOR)
   * Nota: El backend actual tiene /activos para pedidos activos
   * @returns Observable con array de todos los pedidos
   */
  obtenerTodosPedidos(): Observable<Pedido[]> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => 
        this.http.get<Pedido[]>(`${this.API_URL}/activos`, { headers })
      )
    );
  }

  /**
   * Obtener estadísticas de ventas del día (SOLO ADMINISTRADOR)
   * @returns Observable con estadísticas
   */
  obtenerEstadisticasHoy(): Observable<{ totalDinero: number; totalPedidos: number }> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => 
        this.http.get<{ totalDinero: number; totalPedidos: number }>(
          `${this.API_URL}/estadisticas/hoy`, 
          { headers }
        )
      )
    );
  }

  /**
   * Actualizar el estado de un pedido (SOLO ADMINISTRADOR)
   * @param id - ID del pedido
   * @param nuevoEstado - Nuevo estado del pedido
   * @returns Observable con mensaje de éxito
   */
  actualizarEstadoPedido(id: string, nuevoEstado: EstadoPedido): Observable<string> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => 
        this.http.patch<string>(
          `${this.API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`, 
          {}, 
          { headers }
        )
      )
    );
  }

  /**
   * Cancelar un pedido (usuario o admin)
   * @param id - ID del pedido a cancelar
   * @returns Observable con mensaje de éxito
   */
  cancelarPedido(id: string): Observable<string> {
    return this.actualizarEstadoPedido(id, 'CANCELADO');
  }
}
