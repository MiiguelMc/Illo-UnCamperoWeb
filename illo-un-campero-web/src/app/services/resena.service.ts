import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Resena } from '../../model/resena.model';

@Injectable({ providedIn: 'root' })
export class ResenaService {
    private http = inject(HttpClient);
    private auth = inject(Auth);
    private API_URL = 'https://illo-uncamperobackend.onrender.com/api/resenas';

    private async getAuthHeaders(): Promise<HttpHeaders> {
        const user = this.auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');
        const token = await user.getIdToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    obtenerResenas(): Observable<Resena[]> {
        return this.http.get<Resena[]>(this.API_URL);
    }

    crearResena(resena: { idPedido: string; puntuacion: number; comentario?: string }): Observable<string> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.post(this.API_URL, resena, { headers, responseType: 'text' })
            )
        );
    }
}
