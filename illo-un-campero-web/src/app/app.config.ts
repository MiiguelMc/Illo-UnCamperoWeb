import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyCuFeD7nPAxbG2rVQVHp2tKGhyCQt2ZFlQ",
  authDomain: "illo-uncampero.firebaseapp.com",
  projectId: "illo-uncampero",
  storageBucket: "illo-uncampero.firebasestorage.app",
  messagingSenderId: "478864200524",
  appId: "1:478864200524:web:7ac0cc4c432d085f9d35e9"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Configuración de proveedores de Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) // Ahora Firestore está activo para guardar datos
  ]
};