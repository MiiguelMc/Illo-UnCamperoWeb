import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido } from '../../../model/pedido.model';
import { switchMap, take, of, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-mis-pedidos',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './mis-pedidos.html',
    styleUrls: ['./mis-pedidos.css']
})
export class MisPedidosComponent implements OnInit, OnDestroy {
    private pedidoService = inject(PedidoService);
    private authService = inject(AuthService);
    private router = inject(Router);

    pedidos = signal<Pedido[]>([]);
    cargando = signal(true);
    error = signal('');

    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.authService.user$.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    this.error.set('Debes iniciar sesión para ver tus pedidos.');
                    this.cargando.set(false);
                    return of([]);
                }
                return this.pedidoService.obtenerPedidosUsuario(user.uid);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (pedidos) => {
                this.pedidos.set(pedidos.sort((a, b) => b.fecha - a.fecha));
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('Error al cargar tus pedidos.');
                this.cargando.set(false);
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    cancelarPedido(pedidoId: string) {
        if (!confirm('¿Seguro que quieres cancelar este pedido?')) return;
        this.pedidoService.cancelarPedido(pedidoId).subscribe({
            next: () => {
                this.pedidos.update(lista =>
                    lista.map(p => p.id === pedidoId ? { ...p, estado: 'CANCELADO' as const } : p)
                );
            },
            error: () => alert('No se pudo cancelar el pedido.')
        });
    }

    repetirPedido(pedido: Pedido) {
        this.pedidoService.repetirPedido(pedido);
        this.router.navigate(['/carrito']);
    }

    verSeguimiento(pedidoId: string) {
        this.router.navigate(['/seguimiento', pedidoId]);
    }

    puedeRastrear(estado: string): boolean {
        return ['PENDIENTE', 'COCINANDO', 'REPARTO'].includes(estado);
    }

    puedeValorar(pedido: Pedido): boolean {
        return pedido.estado === 'ENTREGADO';
    }

    getEstadoColor(estado: string): string {
        const colores: Record<string, string> = {
            PENDIENTE: '#f39c12', COCINANDO: '#3498db',
            REPARTO: '#1abc9c', ENTREGADO: '#27ae60', CANCELADO: '#e74c3c'
        };
        return colores[estado] || '#95a5a6';
    }

    formatearFecha(fecha: number): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    idCorto(id: string): string {
        return id.substring(0, 8).toUpperCase();
    }
}
