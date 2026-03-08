import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoItemComponent } from '../producto-item/producto-item';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../../model/producto.model';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule, ProductoItemComponent],
  templateUrl: './carta.html',
  styleUrls: ['./carta.css']
})
export class CartaComponent implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;

  // MIRA AQUÍ PAPI: 'todos' para que al principio salga to' el combo
  filtroActual: string = 'todos'; 

  subCamperos = ['Vegano', 'Vegetariano', 'Carnivoro', 'Pan de Pizza', 'Mini'];
  subEntrantes = ['Ensalada', 'Patata', 'Croqueta', 'Variante'];

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: (err) => console.error('Oye, falló la vuelta cargando la carta:', err)
    });
  }

  // ESTA ES LA QUE MANDA: Cambia el filtro y limpia la pantalla
  setFiltro(categoria: string) {
    this.filtroActual = categoria;
    window.scrollTo({top: 250, behavior: 'smooth'}); // Un pequeño ajuste pa' que se vea bien
  }

  abrirModal(p: Producto) {
    this.productoSeleccionado = p;
    this.cantidadSeleccionada = 1;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.productoSeleccionado = null;
    document.body.style.overflow = 'auto';
  }

  incrementar() { this.cantidadSeleccionada++; }
  decrementar() { if (this.cantidadSeleccionada > 1) this.cantidadSeleccionada--; }

  agregarAlPedido() {
    if (this.productoSeleccionado) {
      this.carritoService.agregar(this.productoSeleccionado, this.cantidadSeleccionada);
      this.cerrarModal();
    }
  }

  // --- LÓGICA DE FILTRADO RECOGE-CABLE ---
  getPorCategoria(nombreCat: string): Producto[] {
    return this.productos.filter(p =>
      p.categoria?.toLowerCase().trim().includes(nombreCat.toLowerCase().trim())
    );
  }

  getPorSubcategoria(cat: string, subKeyword: string): Producto[] {
    return this.productos.filter(p => {
      const coincideCat = p.categoria?.toLowerCase().includes(cat.toLowerCase());
      const textoABuscar = ((p.subcategoria || '') + ' ' + (p.nombre || '')).toLowerCase();
      return coincideCat && textoABuscar.includes(subKeyword.toLowerCase());
    });
  }

  getOtros(cat: string, palabrasClave: string[]): Producto[] {
    return this.productos.filter(p => {
      const coincideCat = p.categoria?.toLowerCase().includes(cat.toLowerCase());
      const textoABuscar = ((p.subcategoria || '') + ' ' + (p.nombre || '')).toLowerCase();
      const yaEstaEnSub = palabrasClave.some(kw => textoABuscar.includes(kw.toLowerCase()));
      return coincideCat && !yaEstaEnSub;
    });
  }
}