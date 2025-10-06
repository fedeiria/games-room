import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '../../enums/user-role.enum';
import { Auth } from '../supabase/auth/auth';
import { Users as SupabaseUsers } from '../supabase/database/users/users';
import { IUser } from '../../interfaces/user/iuser';

@Injectable({
  providedIn: 'root'
})
export class Users {
  
  private userRoleSubject = new BehaviorSubject<UserRole>(UserRole.Guess);
  public userRole$: Observable<UserRole> = this.userRoleSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$: Observable<IUser | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private supabaseUsers: SupabaseUsers) {
    this.initUserRoleListener();
  }

  // suscripcion al servicio Auth para detectar los cambios de sesion
  private initUserRoleListener(): void {
    this.auth.observableUserDetails$.subscribe(async (userDetails) => {
      const userId = userDetails?.data.user?.id;

      if (userId) {
        // usuario autenticado, cargo el rol
        await this.loadAndSetUser(userId);
      }
      else {
        // usuario deslogueado, cambiar a guess
        this.userRoleSubject.next(UserRole.Guess);
        this.currentUserSubject.next(null);
      }
    });
  }

  // obtengo los datos del usuario logueado incluido el role y los emito  
  private async loadAndSetUser(userId: string): Promise<void> {
    try {
      // obtengo el rol del usuario
      const userData: IUser[] | null = await this.supabaseUsers.getUserData(userId);
      
      if (userData && userData.length > 0) {
        const user: IUser = userData[0];
        
        this.userRoleSubject.next(user.roleId);
        this.currentUserSubject.next(user);
        return;
      }
    }
    catch (error) {
      console.error('[users service] error: ', error);
    }

    // emito guess en caso de error o datos faltantes
    this.userRoleSubject.next(UserRole.Guess);
    this.currentUserSubject.next(null);
  }
}
