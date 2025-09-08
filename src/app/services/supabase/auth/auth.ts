import { Injectable } from '@angular/core';
import { AuthError, AuthResponse, AuthSession, AuthTokenResponsePassword, SupabaseClient, UserResponse } from '@supabase/supabase-js';

import { createSupabaseClientConnection } from '../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private session: AuthSession | null = null;
  private readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createSupabaseClientConnection();
  }

  // registro
  signUpNewUser(email: string, password: string): Promise<AuthResponse> {
    return this.supabaseClient.auth.signUp({ email, password });
  }

  // ingreso
  signInWithEmailAndPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.supabaseClient.auth.signInWithPassword({ email, password });
  }

  // obtiene los datos de sesion del usuario
  get sessionUserData(): AuthSession | null {
    this.supabaseClient.auth.getSession().then(({ data }) => {
      this.session = data.session;
    });
    return this.session;
  }

  // obtiene los detalles de los datos del usuario
  get currentUserDetails(): Promise<UserResponse> {
    return this.supabaseClient.auth.getUser();
  }

  // elimina los datos de sesion del usuario
  signOut(): Promise<{ error: AuthError | null }> {
    return this.supabaseClient.auth.signOut();
  }
}
