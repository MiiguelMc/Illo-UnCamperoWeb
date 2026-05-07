import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut
} from '@angular/fire/auth';
import { Usuario } from '../../model/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);

  private API_URL = `${environment.apiUrl}/usuarios`;

  user$ = authState(this.auth).pipe(
    switchMap(fbUser => {
      if (!fbUser) return of(null);
      return this.http.get<Usuario>(`${this.API_URL}/${fbUser.uid}`).pipe(
        catchError(() => of({
          uid: fbUser.uid,
          nombre: fbUser.displayName || 'Usuario',
          email: fbUser.email || ''
        } as Usuario))
      );
    })
  );

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async register(email: string, pass: string, datosExtra: any) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    const body = { uid: credential.user.uid, email, ...datosExtra };
    // Si el backend falla el usuario ya tiene cuenta en Firebase — no lanzamos error
    // para que pueda hacer login igualmente. El perfil se guardará al actualizar datos.
    try {
      await firstValueFrom(this.http.post(`${this.API_URL}/registro`, body));
    } catch {
      console.warn('Perfil no guardado en backend al registrar, el usuario puede hacer login igualmente.');
    }
    return credential;
  }

  logout() {
    return signOut(this.auth);
  }

  updateUserData(uid: string, datos: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/perfil`, { ...datos, uid });
  }

  async updatePassword(newPass: string) {
    const user = this.auth.currentUser;
    if (user) return updatePassword(user, newPass);
    throw new Error('No hay usuario autenticado');
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async eliminarCuenta(): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.API_URL}/cuenta`));
    await signOut(this.auth);
  }
}
