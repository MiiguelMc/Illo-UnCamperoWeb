import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido, EstadoPedido } from '../../../model/pedido.model';
import { Subscription, interval } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { PedidoCardCocinaComponent } from '../pedido-card-cocina/pedido-card-cocina';

@Component({
  selector: 'app-cocina-dashboard',
  standalone: true,
  imports: [CommonModule, PedidoCardCocinaComponent, TranslateModule],
  templateUrl: './cocina-dashboard.html',
  styleUrls: ['./cocina-dashboard.css']
})
export class CocinaDashboardComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private authService  = inject(AuthService);
  private router       = inject(Router);

  pedidosPendientes = signal<Pedido[]>([]);
  pedidosCocinando  = signal<Pedido[]>([]);
  pedidosReparto    = signal<Pedido[]>([]);
  cargando = signal(true);
  error    = signal('');

  private pollSub?: Subscription;
  private pedidosAnteriores = 0;

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (!user) { this.router.navigate(['/login']); return; }
      this.cargarPedidos();
      // Refresca cada 5 segundos
      this.pollSub = interval(5000).subscribe(() => this.cargarPedidos(true));
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  cargarPedidos(silencioso = false) {
    if (!silencioso) this.cargando.set(true);

    this.pedidoService.obtenerTodosPedidos().subscribe({
      next: (pedidos) => {
        const activos = pedidos.filter(p =>
          p.estado === 'PENDIENTE' || p.estado === 'COCINANDO' || p.estado === 'REPARTO'
        );

        const totalActual = activos.length;
        if (!this.cargando() && totalActual > this.pedidosAnteriores) {
          this.reproducirNotificacion();
        }
        this.pedidosAnteriores = totalActual;

        this.pedidosPendientes.set(activos.filter(p => p.estado === 'PENDIENTE'));
        this.pedidosCocinando.set(activos.filter(p => p.estado === 'COCINANDO'));
        this.pedidosReparto.set(activos.filter(p => p.estado === 'REPARTO'));
        this.cargando.set(false);
        this.error.set('');
      },
      error: () => {
        this.error.set('No se pudieron cargar los pedidos.');
        this.cargando.set(false);
      }
    });
  }

  cambiarEstado(pedidoId: string, nuevoEstado: EstadoPedido) {
    this.pedidoService.actualizarEstadoPedido(pedidoId, nuevoEstado).subscribe({
      next: () => this.cargarPedidos(true),
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  refrescarManual() {
    this.cargarPedidos();
  }

  private reproducirNotificacion() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }
}
