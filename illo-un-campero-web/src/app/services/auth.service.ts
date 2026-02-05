import { Injectable, inject } from '@angular/core';
import { updatePassword, getAuth } from '@angular/fire/auth'; // Añade esto a tus imports
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Añadido HttpHeaders
import { Observable, firstValueFrom, from, of } from 'rxjs'; // Añadido from
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

  private API_URL = "https://illo-uncamperobackend.onrender.com/api/usuarios";

  // 1. FLUJO REACTIVO CON TOKEN DE SEGURIDAD
  user$ = authState(this.auth).pipe(
    switchMap(async (fbUser) => {
      if (fbUser) {
        // Si hay usuario en Firebase (recuperado de la persistencia local)
        const token = await fbUser.getIdToken();
        return { fbUser, token };
      }
      return null;
    }),
    switchMap(data => {
      if (data) {
        const { fbUser, token } = data;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
  
        return this.http.get<Usuario>(`${this.API_URL}/${fbUser.uid}`, { headers }).pipe(
          catchError(error => {
            console.error("Error recuperando datos del backend:", error);
            // Si el backend falla pero Firebase tiene sesión, devolvemos un objeto básico
            // para que el header-user se mantenga visible
            return of({ uid: fbUser.uid, nombre: fbUser.displayName || 'Usuario', email: fbUser.email || '' } as Usuario);
          })
        );
      }
      return of(null);
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

  // Actualizar datos en la Base de Datos (Spring Boot)
  updateUserData(uid: string, datos: any): Observable<Usuario> {
    // 1. Obtenemos el usuario actual de Firebase
    const user = this.auth.currentUser;
  
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }
  
    // 2. Convertimos la Promesa del token en un Observable y usamos switchMap
    return from(user.getIdToken()).pipe(
      switchMap(token => {
        // 3. Creamos la cabecera con el Token
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Aseguramos que el backend sepa que va un JSON
        });
  
        // IMPORTANTE: Metemos el uid dentro del objeto que enviamos al backend
        // para que el @RequestBody de Java lo reciba completo.
        const datosCompletos = { ...datos, uid: uid };
  
        console.log("✈️ Enviando actualización al backend a: " + `${this.API_URL}/perfil`);
        
        // 4. Enviamos el PUT. 
        // NOTA: He quitado el ${uid} de la URL porque tu backend no lo pide por URL (@PathVariable)
        return this.http.put<Usuario>(`${this.API_URL}/perfil`, datosCompletos, { headers });
      })
    );
  }
  // Cambiar contraseña en Firebase
  async updatePassword(newPass: string) {
    const user = this.auth.currentUser;
    if (user) {
      return updatePassword(user, newPass);
    }
    throw new Error("No hay usuario autenticado");
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

}