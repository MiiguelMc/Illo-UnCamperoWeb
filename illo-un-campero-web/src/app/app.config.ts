import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, browserLocalPersistence } from '@angular/fire/auth';
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

    // 🔥 ngx-translate nuevo
    provideTranslateService({
      defaultLanguage: 'es',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),

    // 🔥 Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      auth.setPersistence(browserLocalPersistence);
      return auth;
    }),
    provideFirestore(() => getFirestore())
  ]
};