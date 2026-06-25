import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../../model/producto.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private http = inject(HttpClient);
    private firestore = inject(Firestore);
    private API_URL = `${environment.apiUrl}/productos`;

    // La carta lee el menú directamente de Firestore desde el navegador.
    // (El backend en Render no puede leer Firestore por un problema con la región
    // de la base; el navegador usa otro canal y sí puede.)
    obtenerProductos(): Observable<Producto[]> {
        const ref = collection(this.firestore, 'productos');
        return (collectionData(ref, { idField: 'id' }) as Observable<Producto[]>).pipe(
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
