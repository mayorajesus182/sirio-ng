import { Directive, Input, HostListener } from '@angular/core';
import { FormControl, NgControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[docNumberValidate],[doc-number-validate]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DocNumberValidateDirective, multi: true }
    ]
})
export class DocNumberValidateDirective implements Validator{
    @Input('tipo_documento') tipoDocumento: string;

    constructor() { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validateIdentificacion(c);
    }


    private validateIdentificacion(control: FormControl): ValidationErrors | null {

        if (control.value === undefined) {
            return null;
        }
        

        const value = control.value;
        // const value = target.value;
        const tipoDocumento = this.tipoDocumento;
        const maxLength = 9;
        // const specialChars = /[^a-zA-Z0-9 ]/;
        const onlyNumbers = /^[0-9]+$/;
        const numbersAndDash = /^[0-9-]+$/;
        const alphanumeric = /^[a-zA-Z0-9]+$/;

        console.log('tipoDoc ', tipoDocumento);
        console.log('validar ', value);
        console.log('length ', value.length);


        /**
         * CASE "V"//V	Cédula de identidad venezolanos
            this.limit = 8
        CASE "E"//E	Extranjeros residentes
            this.limit = 8
        CASE "M"//M	Menores venezolanos
            this.limit = 8
        CASE "N"//N	Menores extranjeros
            this.limit = 8
        CASE "J"//J	R.I.F. de entes jurídicos
            this.limit = 9
        CASE "C"//J	R.I.F. de Comunas
            this.limit = 9
        CASE "G"//J	R.I.F. de entes jurídicos
        //BV-ALT328 BEGIN
        //	this.limit = 8
            this.limit = 9
        //BV-ALT328 END
        CASE ELSE
            this.limit = 11
         * 
         */
        let error =  null;

        switch (tipoDocumento) {
            case 'V':
            case 'M':
            case 'N':
            case 'E':
                error = this.validateId(value, 8, onlyNumbers);
                break;
            case 'J':
            case 'C':
            case 'G':
                error = this.validateId(value, 9, numbersAndDash);
                break;
            case 'P':
                error = this.validateId(value, 11, alphanumeric);
                break;
            default:
                break;
        }

        return error;

    }

    // @HostListener('input', ['$event.target'])
    // onInput(target: HTMLInputElement) {
        

    // }

    // validate(control: AbstractControl): { [key: string]: string } | null {
    //     return validateAccount()(control);
    // }

    private validateId(value, maxLength: number, regexpress) {


        console.log('result length ', length);
        console.log('result regexp ', regexpress, regexpress.test(value));


        if (value.length > maxLength) {
            // control.control.setErrors({ maxLength: true, length: maxLength });
            return { maxLength: true, length: maxLength };
        } else if (!regexpress.test(value)) {
            // control.setErrors({ pattern: true });
            return { pattern: true };
        }
        // else {
        //     this.control.control.setErrors(null);
        // }
        return null;
    }
}