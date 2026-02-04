import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoItemComponent } from '../producto-item/producto-item';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../../model/producto.model';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule, ProductoItemComponent],
  templateUrl: './carta.html',
  styleUrls: ['./carta.css']
})
export class CartaComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (res) => {
        this.productos = res;
        // ESTO ES CLAVE: Abre la consola (F12) y verás una tabla con tus datos reales
        console.table(res); 
      },
      error: (err) => console.error('Error al cargar la carta:', err)
    });
  }

  // Filtra por categoría principal (ignorando mayúsculas/minúsculas)
  getPorCategoria(nombreCat: string): Producto[] {
    return this.productos.filter(p => 
      p.categoria?.toLowerCase().trim() === nombreCat.toLowerCase().trim()
    );
  }

  // Filtra por subcategoría dentro de una categoría
  getPorSubcategoria(cat: string, sub: string): Producto[] {
    return this.productos.filter(p => 
      p.categoria?.toLowerCase().trim() === cat.toLowerCase().trim() &&
      p.subcategoria?.toLowerCase().trim().includes(sub.toLowerCase().trim())
    );
  }

  // Productos que NO tienen una subcategoría de las que buscamos (para que no se pierdan)
  getOtros(cat: string, subCategoriasConocidas: string[]): Producto[] {
    return this.productos.filter(p => {
      const esDeLaCategoria = p.categoria?.toLowerCase().trim() === cat.toLowerCase().trim();
      const esSubconocida = subCategoriasConocidas.some(sub => 
        p.subcategoria?.toLowerCase().trim().includes(sub.toLowerCase().trim())
      );
      return esDeLaCategoria && !esSubconocida;
    });
  }
}