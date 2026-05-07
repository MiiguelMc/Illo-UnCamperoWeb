import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from '../../model/resena.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResenaService {
    private http = inject(HttpClient);
    private API_URL = `${environment.apiUrl}/resenas`;

    obtenerResenas(): Observable<Resena[]> {
        return this.http.get<Resena[]>(this.API_URL);
    }

    crearResena(resena: { idPedido: string; puntuacion: number; comentario?: string }): Observable<string> {
        return this.http.post(this.API_URL, resena, { responseType: 'text' });
    }
}
