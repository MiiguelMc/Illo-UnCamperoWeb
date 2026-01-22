import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Añadido HttpHeaders
import { firstValueFrom, Observable, of, from } from 'rxjs'; // Añadido from
import { switchMap, tap, catchError } from 'rxjs/operators';
import { 
  Auth, 
  authState, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from '@angular/fire/auth';
import { Usuario } from '../../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth); 
  private http = inject(HttpClient);

  private API_URL = "https://illo-uncamperobackend.onrender.com/api/usuarios";

  // 1. FLUJO REACTIVO CON TOKEN DE SEGURIDAD
  user$: Observable<Usuario | null> = authState(this.auth).pipe(
    switchMap(async (fbUser) => {
      if (fbUser) {
        // A. Obtenemos el Token (la llave) de Firebase
        const token = await fbUser.getIdToken();
        return { fbUser, token };
      }
      return null;
    }),
    switchMap(data => {
      if (data) {
        const { fbUser, token } = data;
        
        // B. Creamos la cabecera con el Token para el Backend
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        console.log("🔥 Enviando Token al Backend para UID:", fbUser.uid);

        return this.http.get<Usuario>(`${this.API_URL}/${fbUser.uid}`, { headers }).pipe(
          tap(usuarioDB => console.log("✅ Datos recibidos con seguridad:", usuarioDB)),
          catchError(error => {
            console.error("❌ Error en SpringBoot (403/404/500):", error);
            // Seguimos devolviendo un usuario de prueba si falla, para que veas el header
            return of({ 
              uid: fbUser.uid, 
              nombre: 'Usuario (Error DB)', 
              email: fbUser.email || '' 
            } as Usuario);
          })
        );
      } else {
        return of(null);
      }
    })
  );

  // 2. LOGIN (No cambia)
  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // 3. REGISTRO (Añadimos el token también por seguridad)
  async register(email: string, pass: string, datosExtra: any) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    
    // Obtenemos el token del nuevo usuario
    const token = await credential.user.getIdToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const body = {
      uid: credential.user.uid,
      email: email,
      ...datosExtra
    };

    await firstValueFrom(this.http.post(`${this.API_URL}/registro`, body, { headers }));
    
    return credential;
  }

  // 4. LOGOUT
  logout() {
    return signOut(this.auth);
  }
}