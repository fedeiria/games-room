import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Spinner } from "../../shared/spinner/spinner";
import { Iuser } from '../../../interfaces/user/iuser';
import { UserRole } from '../../../enums/user-role.enum';
import { EMAIL_REGEX } from '../../../validators/email.regex';
import { matchFields } from '../../../validators/match.fields';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {

  protected loading: boolean = false;
  private readonly formBuilder = inject(NonNullableFormBuilder);

  newUser: Iuser = {
    email: '',
    name: '',
    surname: '',
    enabled: false,
    roleId: UserRole.User
  }

  registerForm!: FormGroup<{
    email: FormControl<string>;
    name: FormControl<string>;
    surname: FormControl<string>;
    password: FormControl<string>;
    repeatPassword: FormControl<string>;
  }>;

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(EMAIL_REGEX)],
          updateOn: 'blur'
        }),
        name: this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1 ]+$/)],
          updateOn: 'blur'
        }),
        surname: this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1 ]+$/)],
          updateOn: 'blur'
        }),
        password: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(8)],
          updateOn: 'change'
        }),
        repeatPassword: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(8)],
          updateOn: 'change'
        }),
      },
      {
        validators: [matchFields('password', 'repeatPassword')],
        updateOn: 'change'
      }
    );
  }

  // GETTERS
  get name(): FormControl<string> {
    return this.registerForm.controls.name;
  }

  get surname(): FormControl<string> {
    return this.registerForm.controls.surname;
  }

  get email(): FormControl<string> {
    return this.registerForm.controls.email;
  }

  get password(): FormControl<string> {
    return this.registerForm.controls.password;
  }

  get repeatPassword(): FormControl<string> {
    return this.registerForm.controls.repeatPassword;
  }

  onSubmit(): void {
    // build
  }
}
