import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { Usuario } from '../../model/usuario.model'; // Asegúrate de tener este modelo

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private http = inject(HttpClient);

  // El "Subject" que avisará a los Headers si el usuario cambia
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Esto mantiene la sesión activa al refrescar la página
    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser) {
        await this.fetchUserData(fbUser.uid);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  // --- FUNCIÓN DE LOGIN (La que te falta) ---
  async login(email: string, pass: string) {
    // 1. Validamos con Firebase
    const credential = await signInWithEmailAndPassword(this.auth, email, pass);
    // 2. Traemos los datos extra (nombre, etc) desde tu SpringBoot/Firestore
    await this.fetchUserData(credential.user.uid);
  }

  // --- FUNCIÓN DE REGISTRO ---
  async register(email: string, pass: string, datosExtra: any) {
    // 1. Creamos el usuario en Firebase Auth
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    
    // 2. Guardamos los datos (nombre, tlf...) en tu base de datos a través de SpringBoot
    // Aquí mandas el UID y el resto de cosas a tu colega del backend
    await firstValueFrom(
      this.http.post(`https://tu-api-render.com/api/usuarios`, {
        uid: credential.user.uid,
        ...datosExtra
      })
    );
    
    await this.fetchUserData(credential.user.uid);
  }

  // Traer datos del usuario desde el Backend
  private async fetchUserData(uid: string) {
    try {
      const data = await firstValueFrom(
        this.http.get<Usuario>(`https://tu-api-render.com/api/usuarios/${uid}`)
      );
      this.userSubject.next(data);
    } catch (e) {
      console.error("No se pudo traer el nombre del usuario", e);
    }
  }

  logout() {
    signOut(this.auth).then(() => this.userSubject.next(null));
  }
}