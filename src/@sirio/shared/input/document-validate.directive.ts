import { Directive, Input, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[docNumberValidate],[doc-number-validate]'
})
export class DocNumberValidateDirective {
    @Input('tipo_documento') tipoDocumento: string;

    constructor(private control: NgControl) { }

    @HostListener('input', ['$event.target'])
    onInput(target: HTMLInputElement) {
        const value = target.value;
        const tipoDocumento = this.tipoDocumento;
        const maxLength = 9;
        // const specialChars = /[^a-zA-Z0-9 ]/;
        const onlyNumbers = /^[0-9]+$/;
        const numbersAndDash = /^[0-9-]+$/;
        const alphanumeric = /^[a-zA-Z0-9]+$/;

        // console.log('tipoDoc ', tipoDocumento);
        // console.log('validar ', value);
        // console.log('length ', value.length);


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


        switch (tipoDocumento) {
            case 'V':
            case 'M':
            case 'N':
            case 'E':
                this.validate(value, 8, onlyNumbers);
                break;
            case 'J':
            case 'C':
            case 'G':
                this.validate(value, 9, numbersAndDash);
                break;
            case 'P':
                this.validate(value, 11, alphanumeric);
                break;
            default:
                break;
        }

    }

    private validate(value, maxLength: number, regexpress) {


        // console.log('result regexp ', regexpress, regexpress.test(value));


        if (value.length > maxLength) {
            this.control.control.setErrors({ maxLength: true, length: maxLength });
        } else if (!regexpress.test(value)) {
            this.control.control.setErrors({ pattern: true });
        } else {
            this.control.control.setErrors(null);
        }
    }
}