import { Injectable, inject } from '@angular/core';
import { updatePassword } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from '@angular/fire/auth';
import { Usuario } from '../../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);

  private API_URL = 'https://illo-uncamperobackend.onrender.com/api/usuarios';

  user$ = authState(this.auth).pipe(
    switchMap(async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        return { fbUser, token };
      }
      return null;
    }),
    switchMap(data => {
      if (data) {
        const { fbUser, token } = data;
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Usuario>(`${this.API_URL}/${fbUser.uid}`, { headers }).pipe(
          catchError(() => {
            return of({ uid: fbUser.uid, nombre: fbUser.displayName || 'Usuario', email: fbUser.email || '' } as Usuario);
          })
        );
      }
      return of(null);
    })
  );

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async register(email: string, pass: string, datosExtra: any) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    const token = await credential.user.getIdToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { uid: credential.user.uid, email, ...datosExtra };
    await firstValueFrom(this.http.post(`${this.API_URL}/registro`, body, { headers }));
    return credential;
  }

  logout() {
    return signOut(this.auth);
  }

  updateUserData(uid: string, datos: any): Observable<Usuario> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    return from(user.getIdToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        const datosCompletos = { ...datos, uid };
        return this.http.put<Usuario>(`${this.API_URL}/perfil`, datosCompletos, { headers });
      })
    );
  }

  async updatePassword(newPass: string) {
    const user = this.auth.currentUser;
    if (user) return updatePassword(user, newPass);
    throw new Error('No hay usuario autenticado');
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}
