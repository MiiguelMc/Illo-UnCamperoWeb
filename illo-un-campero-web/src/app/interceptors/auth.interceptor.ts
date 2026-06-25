import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { supabase } from '../services/supabase.client';
import { environment } from '../../environments/environment';

/**
 * Añade el header Authorization (Bearer access_token de Supabase) a todas
 * las peticiones a nuestra API. getSession() devuelve la sesión cacheada y
 * refresca el token si hace falta, así que las peticiones al cargar la página
 * salen con un token válido.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return from(supabase.auth.getSession()).pipe(
    switchMap(({ data }) => {
      const token = data.session?.access_token;
      if (!token) {
        return next(req);
      }
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    })
  );
};
