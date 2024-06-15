import { AbstractControl, ValidatorFn } from '@angular/forms';

export function documentFormatValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const valid = /^\d{7}-\d{1}$/.test(control.value);
    return valid ? null : { 'invalidCedula': {value: control.value} };
  };
}
