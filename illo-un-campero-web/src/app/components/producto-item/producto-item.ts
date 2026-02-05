import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../model/producto.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-item.html',
  styleUrls: ['./producto-item.css']
})
export class ProductoItemComponent {
  @Input() producto!: Producto;
  private carritoService = inject(CarritoService);

  // Sincroniza la cantidad con el carrito en tiempo real
  cantidadEnCarrito = computed(() => {
    const item = this.carritoService.items().find(i => i.producto.nombre === this.producto.nombre);
    return item ? item.cantidad : 0;
  });

  sumar(event: Event) {
    event.stopPropagation(); // Evita abrir el modal
    this.carritoService.agregar(this.producto, 1);
  }

  restar(event: Event) {
    event.stopPropagation(); // Evita abrir el modal
    this.carritoService.quitar(this.producto);
  }
}