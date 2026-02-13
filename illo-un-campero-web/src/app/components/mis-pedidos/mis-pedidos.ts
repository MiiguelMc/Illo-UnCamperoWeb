import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido } from '../../../model/pedido.model';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-pedidos.html',
  styleUrls: ['./mis-pedidos.css']
})
export class MisPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.pedidoService.obtenerPedidosUsuario(user.uid).subscribe({
            next: (pedidos) => {
              // Ordenar por fecha descendente (más recientes primero)
              // El backend devuelve 'fecha' como timestamp (número)
              this.pedidos.set(
                pedidos.sort((a, b) => b.fecha - a.fecha)
              );
              this.cargando.set(false);
            },
            error: (err) => {
              console.error('Error al cargar pedidos:', err);
              this.error.set('Error al cargar tus pedidos');
              this.cargando.set(false);
            }
          });
        } else {
          this.error.set('Debes iniciar sesión para ver tus pedidos');
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.error.set('Error de autenticación');
        this.cargando.set(false);
      }
    });
  }

  // Método para obtener el color según el estado del backend
  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'PENDIENTE': '#f39c12',
      'COCINANDO': '#3498db',
      'REPARTO': '#1abc9c',
      'ENTREGADO': '#27ae60',
      'CANCELADO': '#e74c3c'
    };
    return colores[estado] || '#95a5a6';
  }

  // Método para formatear la fecha desde timestamp (número)
  formatearFecha(fecha: number | Date | string): string {
    // Si es número (timestamp de Java), convertir a Date
    const date = typeof fecha === 'number' ? new Date(fecha) : new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Cancelar pedido (solo si está pendiente)
  cancelarPedido(pedidoId: string) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: () => {
          // Recargar pedidos
          this.cargarPedidos();
        },
        error: (err) => {
          console.error('Error al cancelar pedido:', err);
          alert('No se pudo cancelar el pedido');
        }
      });
    }
  }
}
