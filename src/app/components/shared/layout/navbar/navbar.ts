import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UserRole } from '../../../../enums/user-role.enum';
import { Auth } from '../../../../services/supabase/auth/auth';
import { IUser } from '../../../../interfaces/user/iuser';
import { Users } from '../../../../services/users/users';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnDestroy, OnInit {

  user: IUser | null = null;
  UserRole = UserRole;
  authState: UserRole = UserRole.Guess;
  private subscriptions: Subscription = new Subscription();

  constructor(private auth: Auth, private users: Users, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.add(
        this.users.userRole$.subscribe(role => {
        this.authState = role;
      })
    );
    
    this.subscriptions.add(
      this.users.currentUser$.subscribe(user => {
        this.user = user;
      })
    );
  }

  public signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/login']);
    this.user = null;
    this.authState = UserRole.Guess;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
