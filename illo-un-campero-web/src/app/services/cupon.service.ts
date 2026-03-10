import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Cupon, ValidacionCupon } from '../../model/cupon.model';

@Injectable({ providedIn: 'root' })
export class CuponService {
    private http = inject(HttpClient);
    private auth = inject(Auth);
    private API_URL = 'https://illo-uncamperobackend.onrender.com/api/cupones';

    private async getAuthHeaders(): Promise<HttpHeaders> {
        const user = this.auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');
        const token = await user.getIdToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    validarCupon(codigo: string): Observable<ValidacionCupon> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.post<ValidacionCupon>(`${this.API_URL}/validar`, { codigo }, { headers })
            )
        );
    }

    listarCupones(): Observable<Cupon[]> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.get<Cupon[]>(this.API_URL, { headers })
            )
        );
    }

    crearCupon(cupon: { codigo: string; descuento: number }): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.post(this.API_URL, cupon, { headers, responseType: 'text' })
            )
        );
    }

    desactivarCupon(id: string): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.patch(`${this.API_URL}/${id}/desactivar`, {}, { headers, responseType: 'text' })
            )
        );
    }
}
