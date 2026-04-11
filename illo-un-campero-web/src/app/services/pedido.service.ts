import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Pedido, CrearPedidoDTO, EstadoPedido } from '../../model/pedido.model';
import { CarritoService } from './carrito.service';
import { Producto } from '../../model/producto.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
    private http = inject(HttpClient);
    private auth = inject(Auth);
    private carritoService = inject(CarritoService);

    private API_URL = `${environment.apiUrl}/pedidos`;

    private async getAuthHeaders(): Promise<HttpHeaders> {
        const user = this.auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');
        const token = await user.getIdToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    crearPedido(pedidoDTO: CrearPedidoDTO): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.post(`${this.API_URL}/realizar-pedido`, pedidoDTO, { headers, responseType: 'text' })
            )
        );
    }

    obtenerPedidosUsuario(uid: string): Observable<Pedido[]> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.get<Pedido[]>(`${this.API_URL}/usuario/${uid}`, { headers })
            )
        );
    }

    obtenerPedidoPorId(id: string): Observable<Pedido> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.get<Pedido>(`${this.API_URL}/${id}`, { headers })
            )
        );
    }

    obtenerTodosPedidos(): Observable<Pedido[]> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.get<Pedido[]>(`${this.API_URL}/activos`, { headers })
            )
        );
    }

    obtenerEstadisticasHoy(): Observable<{ totalDinero: number; totalPedidos: number }> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.get<{ totalDinero: number; totalPedidos: number }>(
                    `${this.API_URL}/estadisticas/hoy`, { headers }
                )
            )
        );
    }

    actualizarEstadoPedido(id: string, nuevoEstado: EstadoPedido): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.patch<string>(
                    `${this.API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`,
                    {}, { headers }
                )
            )
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
