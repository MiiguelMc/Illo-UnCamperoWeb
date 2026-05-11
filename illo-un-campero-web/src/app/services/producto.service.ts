import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../../model/producto.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private http = inject(HttpClient);
    private API_URL = `${environment.apiUrl}/productos`;
    private readonly dominiosImagenBloqueados = [
        's2.elespanol.com'
    ];

    obtenerProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.API_URL).pipe(
            map(productos => (productos || []).map(producto => this.normalizarImagenes(producto)))
        );
    }

    crearProducto(producto: Producto): Observable<string> {
        return this.http.post(this.API_URL, producto, { responseType: 'text' });
    }

    editarProducto(id: string, producto: Producto): Observable<string> {
        return this.http.put(`${this.API_URL}/${id}`, producto, { responseType: 'text' });
    }

    eliminarProducto(id: string): Observable<string> {
        return this.http.delete(`${this.API_URL}/${id}`, { responseType: 'text' });
    }

    private normalizarImagenes(producto: Producto): Producto {
        return {
            ...producto,
            imagen: this.esImagenBloqueada(producto.imagen) ? undefined : producto.imagen,
            imagenUrl: this.esImagenBloqueada(producto.imagenUrl) ? undefined : producto.imagenUrl,
        };
    }

    private esImagenBloqueada(url?: string): boolean {
        if (!url) return false;

        try {
            const hostname = new URL(url).hostname;
            return this.dominiosImagenBloqueados.some(dominio => hostname === dominio);
        } catch {
            return false;
        }
    }
}
