import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { TiendaService } from '../../services/tienda.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../../model/producto.model';
import { take } from 'rxjs/operators';

type PackItem = {
  qty: number;
  match: (p: Producto) => boolean;
};

type PackDef = {
  id: string;
  titleKey: string;
  descKey: string;
  items: PackItem[];
};

@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './restaurantes.html',
  styleUrls: ['./restaurantes.css']
})
export class RestauranteComponent implements OnInit, OnDestroy {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly tienda = inject(TiendaService);

  ofertas: Producto[] = [];
  camperos: Producto[] = [];
  entrantes: Producto[] = [];
  postres: Producto[] = [];
  bebidas: Producto[] = [];
  private disponibles: Producto[] = [];

  categoriaActiva: string = '';

  packs: PackDef[] = [
    {
      id: 'pareja',
      titleKey: 'RESTAURANTES.PACKS.PAREJA.TITULO',
      descKey: 'RESTAURANTES.PACKS.PAREJA.DESC',
      items: [
        { qty: 2, match: (p) => this.isCat(p, 'campero') },
        { qty: 1, match: (p) => this.isCat(p, 'entrant') && this.includesAny(p, ['papa', 'patata']) },
        { qty: 2, match: (p) => this.isCat(p, 'bebida') && this.includesAny(p, ['cerveza', 'beer']) }
      ]
    },
    {
      id: 'colegas',
      titleKey: 'RESTAURANTES.PACKS.COLEGA.TITULO',
      descKey: 'RESTAURANTES.PACKS.COLEGA.DESC',
      items: [
        { qty: 3, match: (p) => this.isCat(p, 'campero') },
        { qty: 2, match: (p) => this.isCat(p, 'entrant') && this.includesAny(p, ['papa', 'patata']) },
        { qty: 3, match: (p) => this.isCat(p, 'bebida') && this.includesAny(p, ['cerveza', 'beer', 'refresco', 'cola', 'fanta', 'sprite']) }
      ]
    },
    {
      id: 'familia',
      titleKey: 'RESTAURANTES.PACKS.FAMILIA.TITULO',
      descKey: 'RESTAURANTES.PACKS.FAMILIA.DESC',
      items: [
        { qty: 4, match: (p) => this.isCat(p, 'campero') },
        { qty: 2, match: (p) => this.isCat(p, 'entrant') && this.includesAny(p, ['croqueta', 'ensalada', 'papa', 'patata']) },
        { qty: 4, match: (p) => this.isCat(p, 'bebida') }
      ]
    }
  ];

  ngOnInit() {
    this.tienda.cargarEstado();
    this.tienda.iniciarPolling();
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        const disponibles = productos.filter(p => p?.disponible !== false);
        this.disponibles = disponibles;
        this.ofertas = disponibles.filter(p => p?.esOferta === true);
        this.camperos = disponibles.filter(p => this.isCat(p, 'campero'));
        this.entrantes = disponibles.filter(p => this.isCat(p, 'entrant'));
        this.postres = disponibles.filter(p => this.isCat(p, 'postre'));
        this.bebidas = disponibles.filter(p => this.isCat(p, 'bebida'));
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  agregarOferta(producto: Producto, event: Event) {
    event.stopPropagation();
    this.carritoService.agregar(producto, 1);
  }

  quitarOferta(producto: Producto, event: Event) {
    event.stopPropagation();
    this.carritoService.quitar(producto);
  }

  cantidadEnCarrito(producto: Producto): number {
    const item = this.carritoService.items().find(i =>
      (i.producto.id && producto.id && i.producto.id === producto.id) ||
      (!i.producto.id && !producto.id &&
        (i.producto.nombre || '').trim() === (producto.nombre || '').trim() &&
        (i.producto.categoria || '').trim() === (producto.categoria || '').trim() &&
        (i.producto.subcategoria || '').trim() === (producto.subcategoria || '').trim())
    );
    return item ? item.cantidad : 0;
  }

  agregarPack(pack: PackDef, event?: Event) {
    event?.stopPropagation();
    if (!this.disponibles.length) return;

    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      for (const it of pack.items) {
        const producto = this.disponibles.find(it.match);
        if (producto) this.carritoService.agregar(producto, it.qty);
      }
      this.router.navigate(['/carrito']);
    });
  }

  precioPack(pack: PackDef): number | null {
    if (!this.disponibles.length) return null;
    let total = 0;

    for (const it of pack.items) {
      const producto = this.disponibles.find(it.match);
      if (!producto) return null;
      total += (producto.precio || 0) * it.qty;
    }

    return total;
  }

  scrollTo(id: string) {
    this.categoriaActiva = id;
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 88;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  private isCat(p: Producto, keyword: string): boolean {
    return (p?.categoria || '').toLowerCase().includes(keyword);
  }

  private includesAny(p: Producto, keywords: string[]): boolean {
    const text = `${p?.nombre || ''} ${p?.descripcion || ''} ${p?.subcategoria || ''}`.toLowerCase();
    return keywords.some(k => text.includes(k));
  }

  ngOnDestroy() {
    this.tienda.detenerPolling();
  }
}
