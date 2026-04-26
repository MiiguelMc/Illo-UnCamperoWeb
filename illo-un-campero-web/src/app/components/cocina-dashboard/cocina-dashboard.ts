import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido, EstadoPedido } from '../../../model/pedido.model';
import { Subscription } from 'rxjs';
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
  private firestore = inject(Firestore);
  private router = inject(Router);

  pedidosPendientes = signal<Pedido[]>([]);
  pedidosCocinando = signal<Pedido[]>([]);
  pedidosReparto  = signal<Pedido[]>([]);
  cargando = signal(true);
  error = signal('');

  private firestoreSub?: Subscription;
  private pedidosAnteriores = 0;

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.suscribirTiempoReal();
    });
  }

  ngOnDestroy() {
    this.firestoreSub?.unsubscribe();
  }

  private suscribirTiempoReal() {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const q = query(pedidosRef, where('estado', 'in', ['PENDIENTE', 'COCINANDO', 'REPARTO']));

    this.firestoreSub = collectionData(q, { idField: 'id' }).subscribe({
      next: (docs: any[]) => {
        const pendientes = docs.filter(p => p.estado === 'PENDIENTE');
        const cocinando  = docs.filter(p => p.estado === 'COCINANDO');
        const reparto    = docs.filter(p => p.estado === 'REPARTO');

        const totalActual = pendientes.length + cocinando.length + reparto.length;
        if (!this.cargando() && totalActual > this.pedidosAnteriores) {
          this.reproducirNotificacion();
        }
        this.pedidosAnteriores = totalActual;

        this.pedidosPendientes.set(pendientes as Pedido[]);
        this.pedidosCocinando.set(cocinando as Pedido[]);
        this.pedidosReparto.set(reparto as Pedido[]);
        this.cargando.set(false);
        this.error.set('');
      },
      error: () => {
        this.error.set('Error al conectar con Firestore en tiempo real.');
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
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  refrescarManual() {
    this.cargando.set(true);
    this.firestoreSub?.unsubscribe();
    this.suscribirTiempoReal();
  }
}
