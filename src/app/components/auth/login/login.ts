import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Spinner } from "../../shared/spinner/spinner";
import { EMAIL_REGEX } from '../../../validators/email.regex';
import { Auth } from '../../../services/supabase/auth/auth';
import { Database } from '../../../services/supabase/database/database';
import { Dialogs } from '../../../services/messages/dialogs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  protected loading: boolean = false;

  constructor(private auth: Auth, private database: Database, private dialog: Dialogs, private router: Router) { }
  
  loginForm = new FormGroup<{ email: FormControl<string | null>; password: FormControl<string | null>; }>({
    email: new FormControl('', [Validators.pattern(EMAIL_REGEX), Validators.required]),
    password: new FormControl('', Validators.required)
  });

  // GETTERS
  get email(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>;
  }

  async onSubmit() {
    // muestro el spinner
    this.loading = true;
    
    try {
      // llamo al servicio para corroborar el login del usuario
      const { data, error } = await this.auth.signInWithEmailAndPassword(this.email.value, this.password.value);
      
      // si el usuario esta registrado...
      if (data.user) {
        
        // busco en supabase y traigo sus datos
        const querySnapshot = await this.database.getUserData(this.email.value);
        
        // guardo el timestamp del login en supabase y redirijo al home
        this.database.saveLoginTimestamp(this.email.value);
        this.router.navigate(['/home']);
      }
      else {
        //muestro error para debug
        console.log('error:', error);
        
        // muestro mensaje de error al usuario
        this.dialog.showDialogMessage({
          title: 'Games Room',
          content: 'Error de Usuario / Contrasena. Verifica tus datos.'
        });
      }
    }
    catch (error: any) {
      // error para debug
      console.log('Login error: ', error);

      let message = 'Ocurrio un error inesperado.';
      message = error.message || message;
      
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
