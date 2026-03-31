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

  cantidadEnCarrito = computed(() => {
    const item = this.carritoService.items().find(i =>
      (i.producto.id && this.producto.id && i.producto.id === this.producto.id) ||
      (!i.producto.id && !this.producto.id &&
        (i.producto.nombre || '').trim() === (this.producto.nombre || '').trim() &&
        (i.producto.categoria || '').trim() === (this.producto.categoria || '').trim() &&
        (i.producto.subcategoria || '').trim() === (this.producto.subcategoria || '').trim())
    );
    return item ? item.cantidad : 0;
  });

  sumar(event: Event) {
    event.stopPropagation();
    this.carritoService.agregar(this.producto, 1);
  }

  restar(event: Event) {
    event.stopPropagation();
    this.carritoService.quitar(this.producto);
  }
}
