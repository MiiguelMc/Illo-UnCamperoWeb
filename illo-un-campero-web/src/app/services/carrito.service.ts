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
        // localStorage no disponible, continuamos sin persistencia
      }
    });
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
    const actual = this._items();
    const index = actual.findIndex(i => i.producto.id === producto.id);
    if (index >= 0) {
      actual[index].cantidad += cantidad;
      this._items.set([...actual]);
    } else {
      this._items.set([...actual, { producto, cantidad }]);
    }
  }

  quitar(producto: Producto) {
    const actual = this._items();
    const index = actual.findIndex(i => i.producto.id === producto.id);
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
    this._items.set(this._items().filter(i => i.producto.id !== producto.id));
  }

  vaciar() {
    this._items.set([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  }
}
