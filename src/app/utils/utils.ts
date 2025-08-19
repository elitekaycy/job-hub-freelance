// phone.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function intlPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    
    const phoneRegex = /^\+[1-9]\d{0,2}-\d{3}-\d{4}/;
    const isValid = phoneRegex.test(value);
    
    return isValid ? null : { 'invalidPhone': { value: control.value } };
  };
}


export const getUserAcroynm = (name: string) => name.split(' ').map(word => word.charAt(0)).join('');