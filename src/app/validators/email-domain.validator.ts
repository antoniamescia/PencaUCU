import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailDomainValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    if (email) {
      const domain = email.split('@')[1];
      if (domain !== 'ucu.edu.uy' && domain !== 'ucu.uy' && domain !== 'correo.ucu.edu.uy') {
        return { 'invalidDomain': true };
      }
    }
    return null;
  };
}
