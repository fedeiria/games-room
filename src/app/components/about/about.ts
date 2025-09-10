import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

  constructor(private router: Router) { }

  backToHome() {
    this.router.navigate(['/']);
  }
}
