import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Spinner } from "../../shared/spinner/spinner";
import { EMAIL_REGEX } from '../../../validators/email.regex';
import { Authentication } from '../../../services/auth/authentication';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  protected loading: boolean = false;

  constructor(private authentication: Authentication) { }
  
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

  async onSubmit() {
    try {
      this.loading = true;
      const userCredential = await this.authentication.login(this.email.value, this.password.value);
      
      // si el usuario esta registrado...
      if (userCredential) {
        
        // obtengo su token
        const user = userCredential.user;
        const userToken = await user.getIdToken();

        // busco en firestore y traigo sus datos
        const querySnapshot = await this.firestoreService.getUser(this.email.value);

        //copio los datos a un objeto
        const document = querySnapshot.docs[0]; 
        const userEnabled = document.get('enabled');

        if (userEnabled) {
          const userData = {
            name: document.get('name'),
            surname: document.get('surname'),
            email: document.get('email'),
            roleId: document.get('roleId'),
            enabled: document.get('enabled')
          }
          // guardo en localStorage el profile del usuario y su token
          this.localStorageService.setUserData(userData);
          this.localStorageService.setUserToken(userToken);

          // guardo en firestore el timestamp del login y redirijo al home
          this.firestoreService.saveLoginTimestamp(this.email.value);
          this.router.navigate(['/home']);
        }
        else {
          // muestro mensaje de error
          this.loading = false;
          this.dialogService.showDialogMessage({
            title: "Games Room",
            content: "Usuario deshabilitado. Comunicate con nuestro soporte: support@games-room.com."
          });
        }
      }
    }
    catch (error: any) {
      //oculto el spinner
      this.loading = false;

      // error para debugging
      console.log('Login error: ', error);

      let message = 'Ocurrio un error inesperado.';

      switch (error.code) {
        case 'auth/invalid-credential':
          message = 'Credenciales incorrectas.';
          break;
        case 'auth/network-request-failed':
          message = 'Error de red. Por favor verifica tu conexion a Internet.';
          break;
        default:
          message = error.message || message;
      }
      
      this.dialogService.showDialogMessage({
        title: 'Games Room',
        content: `${message}`
      });
    }
    finally {
      this.loading = false;
    }
  }
}
