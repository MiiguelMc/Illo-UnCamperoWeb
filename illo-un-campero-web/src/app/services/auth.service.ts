import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  user 
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable para saber si el usuario está logueado en la App
  user$ = user(this.auth);

  // INICIO DE SESIÓN
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // REGISTRO COMPLETO (Auth + Firestore)
  async register(datos: any) {
    // 1. Crea el usuario en Authentication
    const credenciales = await createUserWithEmailAndPassword(this.auth, datos.email, datos.password);
    
    // 2. Guarda los datos en la tabla 'usuarios' de Firestore usando el UID
    const userRef = doc(this.firestore, `usuarios/${credenciales.user.uid}`);
    
    return setDoc(userRef, {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      email: datos.email,
      telefono: datos.telefono,
      rol: 'cliente',
      contrasena: datos.password // Se guarda en la tabla según tu imagen
    });
  }

  // CERRAR SESIÓN
  logout() {
    return signOut(this.auth);
  }
}