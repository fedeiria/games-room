import { Injectable, NgZone } from '@angular/core';
import { AuthError, AuthResponse, AuthTokenResponsePassword, SupabaseClient, UserResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

import { createSupabaseClientConnection } from '../../../core/supabase/client-connection';
import { UserRole } from '../../../enums/user-role';

export interface IAuthDetails {
  role: UserRole;
  fullName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  // conexion a supabase
  private readonly supabaseClient: SupabaseClient = createSupabaseClientConnection();

  // observable que emite los detalles del usuario
  private readonly userDetailsSubject = new BehaviorSubject<UserResponse | null>(null);
  public readonly observableUserDetails$: Observable<UserResponse | null> = this.userDetailsSubject.asObservable();

  // observable que emite el estado de carga de supabase
  private readonly authReadySubject = new BehaviorSubject<boolean>(false);
  public readonly observableAuthReady$: Observable<boolean> = this.authReadySubject.asObservable();

  // observable que emite el rol del usuario
  public observableAuthState$!: Observable<IAuthDetails>;

  constructor(private ngZone: NgZone) {
    this.initAuthStateChanges();
    this.getUserRole();
  }

  // registro
  public signUpNewUser(email: string, password: string): Promise<AuthResponse> {
    return this.supabaseClient.auth.signUp({ email, password });
  }

  // login
  public signInWithEmailAndPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.supabaseClient.auth.signInWithPassword({ email, password });
  }

  // suscribe al observable para obtener detalles del usuario y llama al metodo getFullNameAndRoleDataFromDb
  private getUserRole(): void {
    this.observableAuthState$ = this.observableUserDetails$.pipe(
      switchMap(userDetailsResponse => {
        const user = userDetailsResponse?.data.user;

        if (!user) {
          return of({ role: UserRole.Guess, fullName: null } as IAuthDetails);
        }

        return this.getFullNameAndRoleDataFromDb(user.id);
      })
    );
  }

  // obtiene nombre, apellido y rol del usuario
  private async getFullNameAndRoleDataFromDb(userId: string): Promise<IAuthDetails> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('name, surname, role_id')
      .eq('id', userId)
      .single();

      if (error || !data) {
        console.error('[auth service] - error obteniendo el rol del usuario: ', error);
        return { role: UserRole.Guess,  fullName: null };
      }

      const fullName = `${data.name || ''} ${data.surname || ''}`.trim();
      
      return {
        role: data.role_id as UserRole,
        fullName: fullName || null
      };
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

  // obtiene los datos del usuario
  get currentUserDetails(): Promise<UserResponse> {
    return this.supabaseClient.auth.getUser();
  }

  // elimina los datos de sesion del usuario
  public signOut(): Promise<{ error: AuthError | null }> {
    return this.supabaseClient.auth.signOut();
  }
}
