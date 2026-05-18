import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagoService {
    private http = inject(HttpClient);
    private API_URL = `${environment.apiUrl}/pagos`;

    crearIntent(pedidoId: string): Observable<{ clientSecret: string }> {
        return this.http.post<{ clientSecret: string }>(
            `${this.API_URL}/crear-intent`,
            { pedidoId }
        );
    }
}
