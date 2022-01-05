import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function GreaterThanValidator(a: string, b: string, errorName: string): ValidatorFn {
  const fn: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const value = control.value as any[];
    const errors = {};
    if(value[a] < value[b]) {
      errors[errorName] = true;
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }
  return fn;
}