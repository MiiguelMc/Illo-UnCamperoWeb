import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, of } from 'rxjs';
import { switchMap, catchError, take, filter } from 'rxjs/operators';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase.client';
import { Usuario } from '../../model/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private API_URL = `${environment.apiUrl}/usuarios`;

  private session$ = new BehaviorSubject<Session | null>(null);
  private ready$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Restaura la sesión guardada y avisa cuando ya se conoce el estado.
    supabase.auth.getSession().then(({ data }) => {
      this.session$.next(data.session);
      this.ready$.next(true);
    });
    // Mantiene la sesión sincronizada (login, logout, refresco de token).
    supabase.auth.onAuthStateChange((_event, session) => {
      this.session$.next(session);
    });
  }

  /** Emite una vez en cuanto se conoce el estado de sesión inicial. */
  readonly authReady$ = this.ready$.pipe(filter(r => r), take(1));

  user$: Observable<Usuario | null> = this.ready$.pipe(
    filter(r => r),
    take(1),
    switchMap(() => this.session$),
    switchMap(session => {
      const user = session?.user;
      if (!user) return of(null);
      return this.http.get<Usuario>(`${this.API_URL}/${user.id}`).pipe(
        catchError(() => of({
          uid: user.id,
          nombre: (user.user_metadata?.['nombre'] as string) || 'Usuario',
          email: user.email || ''
        } as Usuario))
      );
    })
  );

  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  }

  async register(email: string, pass: string, datosExtra: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { nombre: datosExtra?.nombre } }
    });
    if (error) throw error;

    const uid = data.user?.id;
    if (uid) {
      // Crea el perfil en el backend (endpoint público). No accede a la BD directamente.
      firstValueFrom(
        this.http.post(`${this.API_URL}/registro`, { uid, email, ...datosExtra })
      ).catch((err) => {
        console.error('Error al sincronizar usuario con el backend:', err);
      });
    }

    return data;
  }

  logout() {
    return supabase.auth.signOut();
  }

  updateUserData(uid: string, datos: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/perfil`, { ...datos, uid });
  }

  async updatePassword(newPass: string) {
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) throw error;
  }

  sendPasswordReset(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${environment.siteUrl}/login`
    });
  }

  async eliminarCuenta(): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.API_URL}/cuenta`));
    await supabase.auth.signOut();
  }
}
