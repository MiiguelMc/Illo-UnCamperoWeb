import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {
  // Inyectamos el servicio que creamos antes
  public carritoService = inject(CarritoService);
  private router = inject(Router);

  // Acceso directo a los datos del carrito
  items = this.carritoService.items;
  total = this.carritoService.totalPrecio;

  constructor() {}

  // Fallback cuando la imagen falla o no existe
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.style.background = '#f4f5f7';
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75' viewBox='0 0 75 75'%3E%3Crect width='75' height='75' rx='8' fill='%23f0f0f0'/%3E%3Ctext x='37.5' y='42' font-size='28' text-anchor='middle' fill='%23ccc'%3E%F0%9F%8D%94%3C/text%3E%3C/svg%3E";
    // DIAGNÓSTICO: ver qué datos tiene el producto
    const item = (event as any)._item;
    console.log('[Carrito] Imagen rota. Datos del item:', img.dataset['debug']);
  }

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

  // Navegar a la página de confirmación de pedido
  irAConfirmarPedido() {
    if (this.items().length > 0) {
      this.router.navigate(['/confirmar-pedido']);
    }
  }
}