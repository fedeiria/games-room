import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { Auth } from '../../services/supabase/auth/auth';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

  constructor(private auth: Auth, private router: Router) { }

  backToHome() {
    this.auth.observableUserDetails$.pipe(
      take(1)
    ).subscribe(user => {
      const isLoggued = !!user;

      const targetRoute = isLoggued ? '/home' : '/welcome';

      this.router.navigate([targetRoute]);
    });
  }
}
