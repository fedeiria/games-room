import { Injectable } from '@angular/core';
import { AuthError, AuthResponse, AuthSession, AuthTokenResponsePassword, createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private supabase: SupabaseClient;
  private session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseConfig.supabaseUrl, environment.supabaseConfig.supabaseKey, { auth: { autoRefreshToken: false, persistSession: true } });
  }

  // registro
  signUpNewUser(email: string, password: string): Promise<AuthResponse> {
    return this.supabase.auth.signUp({ email, password });
  }

  // ingreso
  signInWithEmailAndPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // obtiene los datos de sesion del usuario
  get sessionUserData(): AuthSession | null {
    this.supabase.auth.getSession().then(({ data }) => {
      this.session = data.session;
    });
    return this.session;
  }

  // elimina los datos de sesion del usuario
  signOut(): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signOut();
  }
}
