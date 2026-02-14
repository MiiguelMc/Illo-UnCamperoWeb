import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../model/pedido.model';

@Component({
  selector: 'app-pedido-card-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-card-cocina.html',
  styleUrls: ['./pedido-card-cocina.css']
})
export class PedidoCardCocinaComponent implements OnInit {
  @Input() pedido!: Pedido;
  @Input() accionTexto: string = 'Acción';
  @Input() accionColor: string = '#3498db';
  
  @Output() onAccion = new EventEmitter<void>();
  
  tiempoTranscurrido = signal('');

  ngOnInit() {
    this.calcularTiempoTranscurrido();
    
    // Actualizar tiempo cada minuto
    setInterval(() => {
      this.calcularTiempoTranscurrido();
    }, 60000);
  }

  calcularTiempoTranscurrido() {
    const ahora = Date.now();
    const diferencia = ahora - this.pedido.fecha;
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(minutos / 60);
    
    if (horas > 0) {
      this.tiempoTranscurrido.set(`Hace ${horas}h ${minutos % 60}m`);
    } else {
      this.tiempoTranscurrido.set(`Hace ${minutos}m`);
    }
  }

  formatearHora(timestamp: number): string {
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  ejecutarAccion() {
    this.onAccion.emit();
  }

  // Determinar si el pedido es urgente (más de 30 minutos)
  esUrgente(): boolean {
    const diferencia = Date.now() - this.pedido.fecha;
    const minutos = Math.floor(diferencia / 60000);
    return minutos > 30;
  }
}
