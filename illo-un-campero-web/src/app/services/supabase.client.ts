import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Cliente único de Supabase para toda la app (auth).
 * La base de datos NO se accede directamente desde el navegador:
 * todo pasa por el backend Spring. Aquí Supabase solo gestiona el login.
 */
export const supabase: SupabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
