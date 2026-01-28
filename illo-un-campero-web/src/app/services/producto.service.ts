import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../model/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private API_URL = 'https://illo-uncamperobackend.onrender.com/api/productos'; // La URL de tu colega

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }
}