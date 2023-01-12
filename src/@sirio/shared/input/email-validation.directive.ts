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

    //Declaramos la función con los parámetros de entrada
    private static validarEmail(email: string): boolean {
        //Creamos la expresión regular para validar el email
        const expresionRegular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //Retornamos el resultado de la comparación entre la expresión regular y el email ingresado
        return expresionRegular.test(email);
    }

    private static validateEmailValue(control: FormControl): ValidationErrors | null {
       
        if (control.value == undefined || control.value.trim().length ==0) {
            return null;
        }

        // funcion que valide la estructura de email con expression regular y comenta cada linea

        // var regexpresion = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);
        var result = EmailValidate.validarEmail(control.value.toLowerCase());
         //  control.value
        // .toLowerCase()
        // .match(
        //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        // );



        // var modelValue = .toLowerCase();

        // console.log('validate email ', result);

        if (!result) {
            return { email: 'Email inválido' };
        }


        return null;

    }

}