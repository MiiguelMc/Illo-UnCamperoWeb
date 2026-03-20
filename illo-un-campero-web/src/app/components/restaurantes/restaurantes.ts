import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../../model/producto.model';
import { ProductoItemComponent } from '../producto-item/producto-item';

@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [CommonModule, ProductoItemComponent, TranslateModule],
  templateUrl: './restaurantes.html',
  styleUrls: ['./restaurantes.css']
})
export class RestauranteComponent implements OnInit {
  private productoService = inject(ProductoService);

  // Listas filtradas
  camperos: Producto[] = [];
  entrantes: Producto[] = [];
  postres: Producto[] = [];
  bebidas: Producto[] = [];

  categoriaActiva: string = '';

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        // Usamos la misma lógica que os funciona en la carta (.includes es más seguro)
        this.camperos = productos.filter(p => p.categoria.toLowerCase().includes('campero'));
        this.entrantes = productos.filter(p => p.categoria.toLowerCase().includes('entrant'));
        this.postres = productos.filter(p => p.categoria.toLowerCase().includes('postre'));
        this.bebidas = productos.filter(p => p.categoria.toLowerCase().includes('bebida'));
        
        console.log("Productos filtrados:", { 
          camperos: this.camperos.length, 
          entrantes: this.entrantes.length, 
          postres: this.postres.length, 
          bebidas: this.bebidas.length 
        });
      },
      error: (err) => console.error("Error cargando productos", err)
    });
  }

  scrollTo(id: string) {
    this.categoriaActiva = id;
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }
}