import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../../model/producto.model';
import { ProductoItemComponent } from '../producto-item/producto-item';

@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [CommonModule, ProductoItemComponent], // Importamos el hijo aquí
  templateUrl: './restaurantes.html',
  styleUrls: ['./restaurantes.css']
})
export class RestauranteComponent implements OnInit {
  private productoService = inject(ProductoService);

  // Listas para cada categoría que tienes en el HTML
  campero: Producto[] = [];
  patatas: Producto[] = [];
  ensaladas: Producto[] = [];
  bebidas: Producto[] = [];
  pizzas: Producto[] = [];

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        // Filtramos los productos que vienen de la BD por su categoría
        // Asegúrate de que en Firebase la categoría se llame igual que aquí
        this.campero = productos.filter(p => p.categoria.toLowerCase() === 'campero');
        this.patatas = productos.filter(p => p.categoria.toLowerCase() === 'patatas');
        this.ensaladas = productos.filter(p => p.categoria.toLowerCase() === 'ensalada');
        this.bebidas = productos.filter(p => p.categoria.toLowerCase() === 'bebidas');
        this.pizzas = productos.filter(p => p.categoria.toLowerCase() === 'pizzas');
      },
      error: (err) => console.error("Error cargando productos", err)
    });
  }
}