import { Injectable, signal, computed, effect } from '@angular/core';
import { Producto } from '../../model/producto.model';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

const STORAGE_KEY = 'illo_carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private _items = signal<ItemCarrito[]>(this.cargarStorage());

  items = computed(() => this._items());

  totalPrecio = computed(() =>
    this._items().reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0)
  );

  totalItems = computed(() =>
    this._items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      } catch {
        // modo privado o lo que sea, nada grave
      }
    });
  }

  private key(producto: Producto): string {
    return (
      producto.id ??
      `${(producto.nombre || '').trim()}__${(producto.categoria || '').trim()}__${(producto.subcategoria || '').trim()}`
    );
  }

  private cargarStorage(): ItemCarrito[] {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  }

  agregar(producto: Producto, cantidad: number = 1) {
    if (producto?.disponible === false) return;
    const actual = this._items();
    const k = this.key(producto);
    const index = actual.findIndex(i => this.key(i.producto) === k);
    if (index >= 0) {
      actual[index].cantidad += cantidad;
      this._items.set([...actual]);
    } else {
      this._items.set([...actual, { producto, cantidad }]);
    }
  }

  quitar(producto: Producto) {
    const actual = this._items();
    const k = this.key(producto);
    const index = actual.findIndex(i => this.key(i.producto) === k);
    if (index >= 0) {
      if (actual[index].cantidad > 1) {
        actual[index].cantidad--;
        this._items.set([...actual]);
      } else {
        this.eliminar(producto);
      }
    }
  }

  eliminar(producto: Producto) {
    const k = this.key(producto);
    this._items.set(this._items().filter(i => this.key(i.producto) !== k));
  }

  vaciar() {
    this._items.set([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  }
}
