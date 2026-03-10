import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../../model/pedido.model';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
    selector: 'app-seguimiento',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './seguimiento.html',
    styleUrls: ['./seguimiento.css']
})
export class SeguimientoComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private pedidoService = inject(PedidoService);

    pedido = signal<Pedido | null>(null);
    cargando = signal(true);
    error = signal('');

    private pollingSub?: Subscription;
    private pedidoId = '';

    readonly pasos: { estado: EstadoPedido; label: string; descripcion: string }[] = [
        { estado: 'PENDIENTE',  label: 'Recibido',     descripcion: 'Tu pedido ha llegado al restaurante.' },
        { estado: 'COCINANDO',  label: 'Preparando',   descripcion: 'Estamos preparando tu pedido.' },
        { estado: 'REPARTO',    label: 'En camino',    descripcion: 'Tu pedido está de camino.' },
        { estado: 'ENTREGADO',  label: 'Entregado',    descripcion: '¡Pedido entregado! Buen provecho.' },
    ];

    ngOnInit() {
        this.pedidoId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.pedidoId) {
            this.router.navigate(['/mis-pedidos']);
            return;
        }
        this.cargarPedido();

        // Polling cada 15 segundos mientras no esté entregado ni cancelado
        this.pollingSub = interval(15000).subscribe(() => {
            const estado = this.pedido()?.estado;
            if (estado !== 'ENTREGADO' && estado !== 'CANCELADO') {
                this.cargarPedido(true);
            } else {
                this.pollingSub?.unsubscribe();
            }
        });
    }

    ngOnDestroy() {
        this.pollingSub?.unsubscribe();
    }

    cargarPedido(silencioso = false) {
        if (!silencioso) this.cargando.set(true);
        this.pedidoService.obtenerPedidoPorId(this.pedidoId).subscribe({
            next: (p) => {
                this.pedido.set(p);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudo cargar el pedido.');
                this.cargando.set(false);
            }
        });
    }

    getPasoIndex(estado: EstadoPedido): number {
        return this.pasos.findIndex(p => p.estado === estado);
    }

    getEstadoActualIndex(): number {
        const estado = this.pedido()?.estado;
        if (!estado || estado === 'CANCELADO') return -1;
        return this.getPasoIndex(estado);
    }

    esCancelado(): boolean {
        return this.pedido()?.estado === 'CANCELADO';
    }

    formatearHora(timestamp: number): string {
        return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    idCorto(id: string): string {
        return id.substring(0, 8).toUpperCase();
    }
}
