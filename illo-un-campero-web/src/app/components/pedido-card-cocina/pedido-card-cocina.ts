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
    const minutos = Math.floor((Date.now() - this.pedido.fecha) / 60000);
    const horas = Math.floor(minutos / 60);
    this.tiempoTranscurrido.set(
      horas > 0 ? `${horas}h ${minutos % 60}m` : `${minutos}m`
    );
  }

  formatearHora(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  esUrgente(): boolean {
    return Math.floor((Date.now() - this.pedido.fecha) / 60000) > 30;
  }

  ejecutarAccion() {
    this.onAccion.emit();
  }
}
