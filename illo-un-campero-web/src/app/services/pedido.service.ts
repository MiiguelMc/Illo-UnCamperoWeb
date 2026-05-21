import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.post<{ id: string }>(`${this.API_URL}/realizar-pedido`, pedidoDTO)
      .pipe(map(res => res.id));
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

  obtenerTodosPedidosAdmin(desde?: number, hasta?: number): Observable<Pedido[]> {
    let params = '';
    if (desde) params += `?desde=${desde}`;
    if (hasta) params += `${params ? '&' : '?'}hasta=${hasta}`;
    return this.http.get<Pedido[]>(`${this.API_URL}/todos${params}`);
  }

  obtenerTopProductos(desde?: number, hasta?: number): Observable<{ nombre: string; unidades: number }[]> {
    let params = '';
    if (desde) params += `?desde=${desde}`;
    if (hasta) params += `${params ? '&' : '?'}hasta=${hasta}`;
    return this.http.get<{ nombre: string; unidades: number }[]>(
      `${this.API_URL}/estadisticas/productos${params}`
    );
  }

  actualizarEstadoPedido(id: string, nuevoEstado: EstadoPedido): Observable<string> {
    return this.http.patch(
      `${this.API_URL}/${id}/estado?nuevoEstado=${encodeURIComponent(nuevoEstado)}`,
      {},
      { responseType: 'text' }
    );
  }

  cancelarPedido(id: string): Observable<string> {
    return this.http.post(`${this.API_URL}/${id}/cancelar`, {}, { responseType: 'text' });
  }

  confirmarPago(id: string): Observable<string> {
    return this.http.post(`${this.API_URL}/${id}/confirmar-pago`, {}, { responseType: 'text' });
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
