import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {
  // Inyectamos el servicio que creamos antes
  public carritoService = inject(CarritoService);

  // Acceso directo a los datos del carrito
  items = this.carritoService.items;
  total = this.carritoService.totalPrecio;

  constructor() {}

  // Métodos para los botones de la lista
  aumentar(producto: any) {
    this.carritoService.agregar(producto, 1);
  }

  disminuir(producto: any) {
    this.carritoService.quitar(producto);
  }

  eliminar(producto: any) {
    this.carritoService.eliminar(producto);
  }
}