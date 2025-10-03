import { Injectable, NgZone } from '@angular/core';
import { AuthError, AuthResponse, AuthTokenResponsePassword, SupabaseClient, UserResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

import { createSupabaseClientConnection } from '../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly supabaseClient: SupabaseClient = createSupabaseClientConnection();
  private readonly userDetailsSubject = new BehaviorSubject<UserResponse | null>(null);
  public readonly observableUserDetails$: Observable<UserResponse | null> = this.userDetailsSubject.asObservable();

  constructor(private ngZone: NgZone) {
    this.initAuthStateChanges();
  }

  // registro
  signUpNewUser(email: string, password: string): Promise<AuthResponse> {
    return this.supabaseClient.auth.signUp({ email, password });
  }

  // login
  signInWithEmailAndPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.supabaseClient.auth.signInWithPassword({ email, password });
  }

  // listener para escuchar cambios en el estado de autenticacion de un usuario
  private initAuthStateChanges(): void {
    this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
      this.ngZone.run(async () => {
        if (session) {
          const userDetails = await this.currentUserDetails;
          this.userDetailsSubject.next(userDetails);
        }
        else {
          this.userDetailsSubject.next(null);
        }
      });
    });
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
