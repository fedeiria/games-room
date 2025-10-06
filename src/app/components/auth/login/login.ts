import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Spinner } from "../../shared/spinner/spinner";
import { Auth } from '../../../services/supabase/auth/auth';
import { Dialogs } from '../../../services/messages/dialogs';
import { Validations } from '../../../services/validations/validations';
import { Logins } from '../../../services/supabase/database/logins/logins';
import { Users } from '../../../services/users/users';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  public loading: boolean = false;

  public loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(private auth: Auth, private dialog: Dialogs, private formBuilder: NonNullableFormBuilder, private logins: Logins, private router: Router, private users: Users, private validations: Validations) { }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(this.validations.EMAIL_REGEX)],
          updateOn: 'blur'
        }),
        password: this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      }
    );
  }
  
  // GETTERS
  get email(): FormControl<string> {
    return this.loginForm.controls.email;
  }

  get password(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  public async onSubmit(): Promise<void> {
    // muestro el spinner
    this.loading = true;
    
    try {
      // llamo al servicio para corroborar el login del usuario
      const { data, error } = await this.auth.signInWithEmailAndPassword(this.email.value, this.password.value);
      
      // si el usuario esta registrado guardo el timestamp del login en supabase y redirijo al home
      if (data.user) {

        // convierto un observable en una promesa
        await firstValueFrom(
          this.users.currentUser$.pipe(
            filter(user => user !== null)
          )
        );

        this.logins.saveLoginTimestamp(data.user.id);
        this.router.navigate(['/home']);
      }
      // si el usuario no esta registrado...
      else {
        console.error('[login service] error:', error);
        
        // muestro mensaje de error al usuario
        this.dialog.showDialogMessage({
          title: 'Games Room',
          content: 'Error de Usuario / Contraseña. Verifica tus datos.'
        });
      }
    }
    catch (error: unknown) {
      // error para debug
      console.error('[service login] Error: ', error);

      // mensaje por defecto
      let message = 'Ocurrio un error inesperado.';
      
      this.dialog.showDialogMessage({
        title: 'Games Room',
        content: `${message}`
      });
    }
    finally {
      this.loading = false;
    }
  }
}
