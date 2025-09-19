import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UserRole } from '../../../../enums/user-role.enum';
import { Auth } from '../../../../services/supabase/auth/auth';
import { IUser } from '../../../../interfaces/user/iuser';
import { Users } from '../../../../services/supabase/database/users/users';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  user: IUser | null = null;
  UserRole = UserRole;
  authState: UserRole = UserRole.Guess;

  constructor(private auth: Auth, private users: Users, private router: Router) { }

  ngOnInit() {
    this.getUserRole();
  }

  // obtiene el role del usuario
  async getUserRole(): Promise<void> {
    try {
      // obtengo los detalles del usuario logueado
      const userDetails = await this.auth.currentUserDetails;

      // obtengo el id del usuario logueado
      const userId = userDetails.data.user?.id;

      if (!userId) {
        return;
      }

      // obtengo el role_id del usuario
      const userData = await this.users.getUserData(userId);

      if (!userData || userData.length === 0) {
        return;
      }

      const user = userData[0];
      this.user = user;
      this.authState = user.role_id;
    }
    catch (error) {
      console.error('Error al obtener el rol del usuario: ', error);
    }
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/login']);
    this.user = null;
    this.authState = UserRole.Guess;
  }
}
