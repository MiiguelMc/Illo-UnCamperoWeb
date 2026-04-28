import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Añade el header Authorization a todas las peticiones a nuestra API.
 * Ningún servicio necesita construir headers manualmente.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo interceptamos peticiones a nuestro backend
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = inject(Auth);
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
};
