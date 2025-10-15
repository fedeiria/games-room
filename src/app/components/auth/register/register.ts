import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Spinner } from "../../shared/spinner/spinner";
import { IUser } from '../../../interfaces/user/iuser';
import { UserRole } from '../../../enums/user-role';
import { Dialogs } from '../../../services/messages/dialogs';
import { Auth } from '../../../services/supabase/auth/auth';
import { Validations } from '../../../services/validations/validations';
import { Logins } from '../../../services/supabase/database/logins/logins';
import { Users } from '../../../services/supabase/database/users/users';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {

  private newUser!: IUser;
  public loading: boolean = false;

  public registerForm!: FormGroup<{
    email: FormControl<string>;
    name: FormControl<string>;
    surname: FormControl<string>;
    password: FormControl<string>;
    repeatPassword: FormControl<string>;
  }>;

  constructor(private auth: Auth, private dialog: Dialogs, private formBuilder: NonNullableFormBuilder, private logins: Logins, private router: Router, private users: Users, private validations: Validations) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        email: this.formBuilder.control('', {
          validators: [Validators.required, Validators.pattern(this.validations.EMAIL_REGEX)],
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
          validators: [Validators.required],
          updateOn: 'change'
        })
      },
      {
        validators: this.validations.confirmPassword()
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

  public async onSubmit(): Promise<void> {
    // muestro el spinner
    this.loading = true;

    try {
      // llamo al servicio para registrar al nuevo usuario
      const { data, error } = await this.auth.signUpNewUser(this.email.value, this.password.value);

      // si el usuario no existe...
      if (data.user) {
        // guardo los datos del formulario en el objeto
        this.newUser = {
          id: data.user.id,
          name: this.name.value,
          surname: this.surname.value,
          email: this.email.value,
          roleId: UserRole.User
        }

        // guardo los datos del usuario
        await this.users.saveNewUser(this.newUser);

        // guardo la fecha de login del usuario
        await this.logins.saveLoginTimestamp(this.newUser.id);
        
        this.loading = false;

        // muestro mensaje exitoso
        await this.dialog.showDialogMessage({
          title: 'Games Room',
          content: 'Usuario registrado con exito.'
        });

        this.router.navigate(['/home']);
      }
      else {
        //muestro error para debug
        console.error('error supabase:', error);
        
        this.loading = false;

        // muestro mensaje de error al usuario
        await this.dialog.showDialogMessage({
          title: 'Games Room',
          content: 'Ya existe un usuario registrado con el correo: ' + this.email.value
        });
      }
    }
    catch (error: unknown) {
      // error para debug
      console.error('Error durante el registro: ', error);

      // mensaje por defecto
      let message = 'Error inesperado durante el registro.';

      await this.dialog.showDialogMessage({
        title: 'Games Room',
        content: `Ocurrio un error al registrar el usuario: ${message}`
      });
    }
  }
}
