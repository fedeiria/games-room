import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchFields(sourceKey: string, confirmKey: string): ValidatorFn {
    const errorKey: string = 'fieldsMismatch';

    return (group: AbstractControl): ValidationErrors | null => {
        const formGroup = group as FormGroup;
        const sourceField = formGroup.get(sourceKey);
        const confirmField = formGroup.get(confirmKey);

        if (!sourceField || !confirmField) {
            return null;
        }

        const isMatch = sourceField.value === confirmField.value;
        return isMatch ? null : { [errorKey]: { sourceKey, confirmKey } };
    }
}