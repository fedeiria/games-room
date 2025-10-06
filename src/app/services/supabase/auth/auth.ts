import { Injectable, NgZone } from '@angular/core';
import { AuthError, AuthResponse, AuthTokenResponsePassword, SupabaseClient, UserResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

import { createSupabaseClientConnection } from '../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  // crea la conexion a supabase
  private readonly supabaseClient: SupabaseClient = createSupabaseClientConnection();

  // observable para obtener los detalles del usuario
  private readonly userDetailsSubject = new BehaviorSubject<UserResponse | null>(null);
  public readonly observableUserDetails$: Observable<UserResponse | null> = this.userDetailsSubject.asObservable();

  // observable para saber si la carga de supabase a finalizado
  private readonly authReadySubject = new BehaviorSubject<boolean>(false);
  public readonly observableAuthReady$: Observable<boolean> = this.authReadySubject.asObservable();

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

        // verifico si existe una sesion y en base al resultado emito 
        if (session) {
          const userDetails = await this.currentUserDetails;
          this.userDetailsSubject.next(userDetails);
        }
        else {
          this.userDetailsSubject.next(null);
        }

        // emito true cuando supabase haya finalizado la verificacion
        if (!this.authReadySubject.value) {
          this.authReadySubject.next(true);
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
