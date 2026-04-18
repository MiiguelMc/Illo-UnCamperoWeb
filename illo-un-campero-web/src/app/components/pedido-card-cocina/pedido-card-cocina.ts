import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../model/pedido.model';

@Component({
  selector: 'app-pedido-card-cocina',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pedido-card-cocina.html',
  styleUrls: ['./pedido-card-cocina.css']
})
export class PedidoCardCocinaComponent implements OnInit, OnDestroy {
  @Input() pedido!: Pedido;
  @Input() accionTexto: string = 'Acción';
  @Input() accionColor: string = '#3498db';

  @Output() onAccion = new EventEmitter<void>();

  tiempoTranscurrido = signal('');
  private intervaloId?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.calcularTiempoTranscurrido();
    this.intervaloId = setInterval(() => this.calcularTiempoTranscurrido(), 60000);
  }

  ngOnDestroy() {
    if (this.intervaloId) clearInterval(this.intervaloId);
  }

  calcularTiempoTranscurrido() {
    const ts = this.pedido.fecha > 1e12 ? this.pedido.fecha : this.pedido.fecha * 1000;
    const minutos = Math.floor((Date.now() - ts) / 60000);
    const horas = Math.floor(minutos / 60);
    this.tiempoTranscurrido.set(
      horas > 0 && minutos >= 120 ? `${horas}h ${minutos % 60}m` : `${minutos}m`
    );
  }

  calcularTotal(): number {
    return this.pedido.productos.reduce(
      (sum, item) => sum + (item.precioUnidad * item.cantidad), 0
    );
  }

  formatearHora(timestamp: number): string {
    const ts = timestamp > 1e12 ? timestamp : timestamp * 1000;
    return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  esUrgente(): boolean {
    const ts = this.pedido.fecha > 1e12 ? this.pedido.fecha : this.pedido.fecha * 1000;
    return Math.floor((Date.now() - ts) / 60000) > 45;
  }

  ejecutarAccion() {
    this.onAccion.emit();
  }
}
