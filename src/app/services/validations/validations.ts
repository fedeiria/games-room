import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Validations {
  
  public EMAIL_REGEX: string = '[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

  confirmPassword(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const repeatPassword = formGroup.get('repeatPassword');
      const errorMessage = { noMatch: 'Las contraseñas no coinciden'};

      if (password?.value !== repeatPassword?.value) {
        formGroup.get('repeatPassword')?.setErrors(errorMessage);
        return errorMessage;
      }
      else {
        formGroup.get('repeatPassword')?.setErrors(null);
        return null;
      }
    }
  }
}
