import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagoService {
    private http = inject(HttpClient);
    private auth = inject(Auth);

    private API_URL = `${environment.apiUrl}/pagos`;

    private async getAuthHeaders(): Promise<HttpHeaders> {
        const user = this.auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');
        const token = await user.getIdToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    crearIntent(total: number): Observable<{ clientSecret: string }> {
        return from(this.getAuthHeaders()).pipe(
            switchMap(headers =>
                this.http.post<{ clientSecret: string }>(
                    `${this.API_URL}/crear-intent`,
                    { total },
                    { headers }
                )
            )
        );
    }
}
