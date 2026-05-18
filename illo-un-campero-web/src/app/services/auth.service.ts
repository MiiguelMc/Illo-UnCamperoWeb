import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, of } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Usuario } from '../../model/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  private API_URL = `${environment.apiUrl}/usuarios`;

  /** Emite una vez en cuanto Firebase Auth conoce el estado (rápido, sin esperar al backend) */
  readonly authReady$ = authState(this.auth).pipe(take(1));

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
    const uid = credential.user.uid;

    // Guardado directo en Firestore — no depende del backend
    const userRef = doc(this.firestore, `usuarios/${uid}`);
    await setDoc(userRef, {
      uid,
      email,
      nombre: datosExtra.nombre,
      apellidos: datosExtra.apellidos,
      telefono: datosExtra.telefono,
      rol: 'CLIENTE'
    });

    firstValueFrom(
      this.http.post(`${this.API_URL}/registro`, { uid, email, ...datosExtra })
    ).catch((err) => {
      console.error('Error al sincronizar usuario con el backend:', err);
    });

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
