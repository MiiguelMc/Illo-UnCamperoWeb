import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Producto } from '../../model/producto.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private http = inject(HttpClient);
    private auth = inject(Auth);
    private API_URL = `${environment.apiUrl}/productos`;

    private async getAuthHeaders(): Promise<HttpHeaders> {
        const user = this.auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');
        const token = await user.getIdToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    obtenerProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.API_URL);
    }

    crearProducto(producto: Producto): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.post(this.API_URL, producto, { headers, responseType: 'text' })
            )
        );
    }

    editarProducto(id: string, producto: Producto): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.put(`${this.API_URL}/${id}`, producto, { headers, responseType: 'text' })
            )
        );
    }

    eliminarProducto(id: string): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.delete(`${this.API_URL}/${id}`, { headers, responseType: 'text' })
            )
        );
    }
}
