import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { ResenaService } from '../../services/resena.service';
import { Pedido } from '../../../model/pedido.model';
import { switchMap, take, of, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-mis-pedidos',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
    templateUrl: './mis-pedidos.html',
    styleUrls: ['./mis-pedidos.css']
})
export class MisPedidosComponent implements OnInit, OnDestroy {
    private pedidoService = inject(PedidoService);
    private authService = inject(AuthService);
    private resenaService = inject(ResenaService);
    private router = inject(Router);

    pedidos = signal<Pedido[]>([]);
    cargando = signal(true);
    error = signal('');

    // Estado del modal de valoración
    pedidoAValorar = signal<Pedido | null>(null);
    puntuacionModal = signal(0);
    comentarioModal = '';
    enviandoValoracion = signal(false);
    errorValoracion = signal('');
    exitoValoracion = signal(false);

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
                return this.pedidoService.obtenerPedidosUsuario();
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
        const pedido = this.pedidos().find(p => p.id === pedidoId);

        if (!pedido) {
            alert('No se encontro el pedido.');
            return;
        }

        if (pedido.estado !== 'PENDIENTE') {
            alert('Solo puedes cancelar pedidos pendientes.');
            return;
        }

        if (!confirm('¿Seguro que quieres cancelar este pedido?')) return;

        this.pedidoService.cancelarPedido(pedidoId).subscribe({
            next: () => {
                this.pedidos.update(lista =>
                    lista.map(p => p.id === pedidoId ? { ...p, estado: 'CANCELADO' as const } : p)
                );
            },
            error: (err) => alert(this.obtenerMensajeError(err, 'No se pudo cancelar el pedido.'))
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
        return pedido.estado === 'ENTREGADO' && !pedido.valorado;
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

    // ---- Modal valorar ----

    abrirModalValorar(pedido: Pedido) {
        this.pedidoAValorar.set(pedido);
        this.puntuacionModal.set(0);
        this.comentarioModal = '';
        this.errorValoracion.set('');
        this.exitoValoracion.set(false);
    }

    cerrarModalValorar() {
        this.pedidoAValorar.set(null);
    }

    setPuntuacion(n: number) {
        this.puntuacionModal.set(n);
    }

    enviarValoracion() {
        if (this.puntuacionModal() === 0) {
            this.errorValoracion.set('Selecciona una puntuación.');
            return;
        }
        this.enviandoValoracion.set(true);
        this.errorValoracion.set('');

        const pedido = this.pedidoAValorar()!;
        this.resenaService.crearResena({
            idPedido: pedido.id!,
            puntuacion: this.puntuacionModal(),
            comentario: this.comentarioModal
        }).subscribe({
            next: () => {
                this.exitoValoracion.set(true);
                this.enviandoValoracion.set(false);
                setTimeout(() => this.cerrarModalValorar(), 2000);
            },
            error: (err) => {
                this.errorValoracion.set(err?.error || 'Error al enviar la valoración.');
                this.enviandoValoracion.set(false);
            }
        });
    }

    estrellasArray(): number[] {
        return [1, 2, 3, 4, 5];
    }

    private obtenerMensajeError(err: any, fallback: string): string {
        if (typeof err?.error === 'string') return err.error;
        return err?.error?.error || fallback;
    }
}
