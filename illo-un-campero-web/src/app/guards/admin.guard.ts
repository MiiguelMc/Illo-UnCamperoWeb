import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      const rol = user.rol?.toUpperCase();
      if (rol === 'ADMIN' || rol === 'COCINA') {
        return true;
      }
      router.navigate(['/restaurantes']);
      return false;
    })
  );
};
