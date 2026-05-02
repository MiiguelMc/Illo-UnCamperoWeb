import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, CrearPedidoDTO, EstadoPedido } from '../../model/pedido.model';
import { CarritoService } from './carrito.service';
import { Producto } from '../../model/producto.model';
import { environment } from '../../environments/environment';

// Los headers de autenticación los añade AuthInterceptor automáticamente

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private carritoService = inject(CarritoService);

  private API_URL = `${environment.apiUrl}/pedidos`;

  crearPedido(pedidoDTO: CrearPedidoDTO): Observable<string> {
    return this.http.post(`${this.API_URL}/realizar-pedido`, pedidoDTO, { responseType: 'text' });
  }

  obtenerPedidosUsuario(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API_URL}/mis-pedidos`);
  }

  obtenerPedidoPorId(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API_URL}/${id}`);
  }

  obtenerTodosPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API_URL}/activos`);
  }

  obtenerEstadisticasHoy(): Observable<{ totalDinero: number; totalPedidos: number }> {
    return this.http.get<{ totalDinero: number; totalPedidos: number }>(
      `${this.API_URL}/estadisticas/hoy`
    );
  }

  actualizarEstadoPedido(id: string, nuevoEstado: EstadoPedido): Observable<string> {
    return this.http.patch<string>(
      `${this.API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`, {}
    );
  }

  cancelarPedido(id: string): Observable<string> {
    return this.actualizarEstadoPedido(id, 'CANCELADO');
  }

  repetirPedido(pedido: Pedido): void {
    this.carritoService.vaciar();
    pedido.productos.forEach(item => {
      const producto: Producto = {
        id: item.productoId,
        nombre: item.nombre,
        precio: item.precioUnidad,
        descripcion: '',
        categoria: '',
        subcategoria: ''
      };
      this.carritoService.agregar(producto, item.cantidad);
    });
  }
}
