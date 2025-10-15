  import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { Observable } from 'rxjs';
  import { CommonModule } from '@angular/common';

  import { UserRole } from '../../../../enums/user-role';
  import { Auth, IAuthDetails } from '../../../../services/supabase/auth/auth';

  @Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss'
  })
  export class Navbar {

    public UserRole = UserRole;
    public authState$: Observable<IAuthDetails>;

    constructor(private auth: Auth, private router: Router) {
      this.authState$ = this.auth.observableAuthState$ as Observable<IAuthDetails>;
    }

    public signOut(): void {
      this.auth.signOut();
      this.router.navigate(['/login']);
    }
  }
