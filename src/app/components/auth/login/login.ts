import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Spinner } from "../../shared/spinner/spinner";
import { EMAIL_REGEX } from '../../../validators/email.regex';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  protected loading: boolean = false;

  constructor() { }
  
  loginForm = new FormGroup({
    'email': new FormControl('', [Validators.pattern(EMAIL_REGEX), Validators.required]),
    'password': new FormControl('', Validators.required)
  });

  // GETTERS
  get email(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>;
  }

  onSubmit() {
    //build
  }
}
