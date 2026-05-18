import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cupon, ValidacionCupon } from '../../model/cupon.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CuponService {
    private http = inject(HttpClient);
    private API_URL = `${environment.apiUrl}/cupones`;

    validarCupon(codigo: string): Observable<ValidacionCupon> {
        return this.http.post<ValidacionCupon>(`${this.API_URL}/validar`, { codigo });
    }

    listarCupones(): Observable<Cupon[]> {
        return this.http.get<Cupon[]>(this.API_URL);
    }

    crearCupon(cupon: { codigo: string; descuento: number }): Observable<string> {
        return this.http.post(this.API_URL, cupon, { responseType: 'text' });
    }

    desactivarCupon(id: string): Observable<string> {
        return this.http.patch(`${this.API_URL}/${id}/desactivar`, {}, { responseType: 'text' });
    }
}
