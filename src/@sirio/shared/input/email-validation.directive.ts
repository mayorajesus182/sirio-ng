import { ValidationErrors, FormControl, Validator, NG_VALIDATORS, NgControl, AbstractControl } from "@angular/forms";
import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: '[emailValidate],[email-validate]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: EmailValidate, multi: true }
    ]
})
export class EmailValidate implements Validator {


    validate(c: FormControl): ValidationErrors | null {
        return EmailValidate.validateEmailValue(c);
    }

    static email = (control: FormControl) => {

        return EmailValidate.validateEmailValue(control);
    }

    private static validateEmailValue(control: FormControl): ValidationErrors | null {

        if (control.value == undefined) {
            return null;
        }


        var regexpresion = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);


        var modelValue = control.value.toLowerCase();

        //console.log('validate email ', regexpresion.test(modelValue));

        if (!regexpresion.test(modelValue)) {
            return { email: 'Email inválido' };
        }


        return null;

    }

}