import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido, EstadoPedido } from '../../../model/pedido.model';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
  private authService = inject(AuthService);
  private router = inject(Router);

  pedidosPendientes = signal<Pedido[]>([]);
  pedidosCocinando = signal<Pedido[]>([]);
  pedidosReparto  = signal<Pedido[]>([]);
  cargando = signal(true);
  error = signal('');

  private refreshSubscription?: Subscription;
  private pedidosAnteriores = 0;

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.cargarPedidos();
      this.refreshSubscription = interval(30000).subscribe(() => this.cargarPedidos(true));
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  cargarPedidos(esAutoRefresh = false) {
    this.pedidoService.obtenerTodosPedidos().subscribe({
      next: (pedidos) => {
        const pendientes = pedidos.filter(p => p.estado === 'PENDIENTE');
        const cocinando  = pedidos.filter(p => p.estado === 'COCINANDO');
        const reparto    = pedidos.filter(p => p.estado === 'REPARTO');

        const totalActual = pendientes.length + cocinando.length + reparto.length;
        if (esAutoRefresh && totalActual > this.pedidosAnteriores) {
          this.reproducirNotificacion();
        }
        this.pedidosAnteriores = totalActual;

        this.pedidosPendientes.set(pendientes);
        this.pedidosCocinando.set(cocinando);
        this.pedidosReparto.set(reparto);
        this.cargando.set(false);
        this.error.set('');
      },
      error: (err) => {
        if (err.status === 401) {
          this.error.set('Sesión expirada.');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.status === 0) {
          this.error.set('Sin conexión con el servidor.');
        } else {
          this.error.set('Error al cargar los pedidos.');
        }
        this.cargando.set(false);
      }
    });
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

  cambiarEstado(pedidoId: string, nuevoEstado: EstadoPedido) {
    this.pedidoService.actualizarEstadoPedido(pedidoId, nuevoEstado).subscribe({
      next: () => this.cargarPedidos(),
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.error.set('No se pudo cambiar el estado. Inténtalo de nuevo.');
        }
      }
    });
  }

  refrescarManual() {
    this.cargando.set(true);
    this.cargarPedidos();
  }
}
