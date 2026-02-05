import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../../model/producto.model'; // Asegúrate de que la ruta es correcta

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    // Estado privado del carrito
    private _items = signal<ItemCarrito[]>([]);

    // Signals computados (se actualizan solos)
    items = computed(() => this._items());

    totalPrecio = computed(() =>
        this._items().reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0)
    );

    totalItems = computed(() =>
        this._items().reduce((acc, item) => acc + item.cantidad, 0)
    );

    agregar(producto: Producto, cantidad: number = 1) {
        const actual = this._items();
        const index = actual.findIndex(i => i.producto.id === producto.id || i.producto.nombre === producto.nombre);

        if (index >= 0) {
            actual[index].cantidad += cantidad;
            this._items.set([...actual]);
        } else {
            this._items.set([...actual, { producto, cantidad }]);
        }
    }

    quitar(producto: Producto) {
        const actual = this._items();
        const index = actual.findIndex(i => i.producto.nombre === producto.nombre);
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
        this._items.set(this._items().filter(i => i.producto.nombre !== producto.nombre));
    }

    vaciar() { this._items.set([]); }
}