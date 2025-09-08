import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Spinner } from "../../shared/spinner/spinner";
import { IUser } from '../../../interfaces/user/iuser';
import { UserRole } from '../../../enums/user-role.enum';
import { Dialogs } from '../../../services/messages/dialogs';
import { Auth } from '../../../services/supabase/auth/auth';
import { Database } from '../../../services/supabase/database/database';
import { Validations } from '../../../services/validations/validations';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {

  protected loading: boolean = false;
  private readonly formBuilder = inject(NonNullableFormBuilder);

  newUser: IUser = {
    id: '',
    name: '',
    surname: '',
    email: '',
    roleId: UserRole.User
  }

  registerForm!: FormGroup<{
    email: FormControl<string>;
    name: FormControl<string>;
    surname: FormControl<string>;
    password: FormControl<string>;
    repeatPassword: FormControl<string>;
  }>;

  constructor(private auth: Auth, private database: Database, private dialog: Dialogs, private router: Router, private validations: Validations) { }

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

  async onSubmit() {
    // muestro el spinner
    this.loading = true;

    try {
      // llamo al servicio para registrar al nuevo usuario
      const { data, error } = await this.auth.signUpNewUser(this.email.value, this.password.value);

      // si el usuario no existe...
      if (data.user) {
        console.log('datos de usuario: ', data);

        // guardo los datos del formulario en el objeto
        this.newUser = {
          id: data.user.id,
          name: this.name.value,
          surname: this.surname.value,
          email: this.email.value,
          roleId: UserRole.User
        }

        // guardo los datos del usuario
        this.database.saveNewUser(this.newUser);

        // guardo la fecha de login del usuario
        this.database.saveLoginTimestamp(this.newUser.id);

        // ejecuto un delay y redirijo al home
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.router.navigate(['/home']);

        // muestro mensaje exitoso
        this.dialog.showDialogMessage({
          title: 'Games Room',
          content: 'Usuario registrado con exito.'
        });
      }
      else {
        //muestro error para debug
        console.error('error supabase:', error);
        
        // muestro mensaje de error al usuario
        this.dialog.showDialogMessage({
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

      this.dialog.showDialogMessage({
        title: 'Games Room',
        content: `Ocurrio un error al registrar el usuario: ${message}`
      });
    }
    finally {
      this.loading = false;
    }
  }
}
