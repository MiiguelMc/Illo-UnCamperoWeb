import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// Importamos todo lo necesario de @angular/fire/auth
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

  // 1. FLUJO REACTIVO PARA EL HEADER (Esto es lo que hace que cambie solo)
  user$: Observable<Usuario | null> = authState(this.auth).pipe(
    switchMap(fbUser => {
      if (fbUser) {
        // Si hay alguien en Firebase, pedimos los datos reales a SpringBoot
        return this.http.get<Usuario>(`${this.API_URL}/${fbUser.uid}`);
      } else {
        // Si no hay nadie, devolvemos null
        return of(null);
      }
    })
  );

  // 2. FUNCIÓN DE LOGIN
  async login(email: string, pass: string) {
    // Firebase se encarga de validar email/password
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // 3. FUNCIÓN DE REGISTRO (La que te daba error)
  async register(email: string, pass: string, datosExtra: any) {
    // A. Creamos el usuario en Firebase Authentication
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    
    // B. Preparamos el paquete para mandárselo a SpringBoot
    const body = {
      uid: credential.user.uid,
      email: email,
      ...datosExtra // Aquí van nombre, apellidos y teléfono
    };

    // C. Mandamos los datos al backend de tu colega
    // IMPORTANTE: Asegúrate de que su endpoint sea /api/usuarios/registro
    await firstValueFrom(this.http.post(`${this.API_URL}/registro`, body));
    
    return credential;
  }

  // 4. CERRAR SESIÓN
  logout() {
    return signOut(this.auth);
  }
}