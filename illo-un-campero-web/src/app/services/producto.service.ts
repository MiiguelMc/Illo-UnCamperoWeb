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

    // La carta se lee del backend (Postgres vía Spring). Endpoint público.
    obtenerProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.API_URL).pipe(
            map(productos => productos || [])
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
}
