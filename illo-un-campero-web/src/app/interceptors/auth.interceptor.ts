import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Añade el header Authorization a todas las peticiones a nuestra API.
 * Usa authStateReady() para esperar a que Firebase restaure la sesión
 * desde sessionStorage antes de leer auth.currentUser.
 * Sin esto, las peticiones al cargar la página se enviaban sin token (403).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = inject(Auth);

  return from(auth.authStateReady()).pipe(
    switchMap(() => {
      const user = auth.currentUser;
      if (!user) {
        return next(req);
      }
      return from(user.getIdToken()).pipe(
        switchMap(token => {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next(authReq);
        })
      );
    })
  );
};
