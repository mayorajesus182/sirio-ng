import { ValidationErrors, FormControl, Validator, NG_VALIDATORS, NgControl, AbstractControl } from '@angular/forms';
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[validRifNumber],[valid-rif-number]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: RifValidator, multi: true }
    ]
})
export class RifValidator implements Validator {

    @Input('tipo_documento') tipoDocumento: string;

    private legal:string[]=['J','G' ,'C','W','I'];
    private natural:string[]=['V' ,'E' ,'P','R','H'];

    // validate(c: FormControl): ValidationErrors | null {
    //     return RifValidator.validateRifNumber(c);
    // }

    // static validateRif = (tipoPersona?: string) => {

    //     return (control: FormControl) => {

    //         return RifValidator.validateRifNumber(control, tipoPersona);
    //     }
    // }


    constructor() { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validateRifNumber(c);
    }



    private  validateRifNumber(control: FormControl, tipoPerona?: string): ValidationErrors | Boolean {
        
        if (control.value == undefined ) {
            return false;
        }

        if(!this.tipoDocumento){
            return { rif: 'El valor no representa una estructura de RIF, deben seleccionar el tipo de documento' };
        }

        var TYPE = {
            "V": "1",
            "E": "2",
            "J": "3",
            "C": "3",
            "P": "4",
            "G": "5",
            "R": "1",
            "H": "1",
            "I": "3",
            "W": "3",
        };



        var modelValue = control.value;

        var t = this.tipoDocumento;//modelValue.charAt(0);

        if (!TYPE[t]) {
            return { rif: 'El valor no representa una estructura de RIF, deben comenzar con J,V,E,G,P,C,W, H o R' };
        }

        // if (modelValue.indexOf('-') >= 0) {
        //     return { rif: 'El valor no representa una estructura de RIF, este no debe tener el caracter del guión(-)' };
        // }

        let rif = modelValue;
        /*if (rif.trim() === '' || rif.trim().length === 0) {
            return { rif: 'El valor no representa una estructura de RIF, este no debe tener el caracter del guión(-)' };
        }*/
        // var t = rif.charAt(0);

        if (tipoPerona !== undefined) {
            if (tipoPerona === 'NAT' && !this.legal.includes(t)) {
                return { rif: 'El valor suministrado es inválido no pertenece al tipo de persona natural' };
            } else if (tipoPerona === 'JUR' && !this.natural.includes(t)) {
                return { rif: 'El valor suministrado es inválido no pertenece al tipo de persona jurídica' };
            }
        }

        if (rif.length != 10) {
            return { rif: 'El valor no representa una estructura de RIF, su longitud debe ser de diez(10) digitos' };
        }


        //rif = rif.replace(/-/g, "");
        rif = rif.substring(1, rif.length);
        rif = TYPE[t] + rif;
        var controlGen = RifValidator.getControlDigitsRif(rif);

        if (controlGen < 0 || controlGen != rif.charAt(rif.length - 1)) {
            return { rif: 'El valor del RIF suministrado es inválido' };
        }


        return false;

    }

    private static getControlDigitsRif(rif) {
        var OFFICE_LENGTH = 10;
        var WEIGHTS = [4, 3, 2, 7, 6, 5, 4, 3, 2];
        var officeControl = 0;
        try {
            for (var i = 0; i < OFFICE_LENGTH - 1; i++) {
                var digit = parseInt(rif.charAt(i));
                officeControl += eval("digit * WEIGHTS[" + i + "]");
            }
        } catch (e) {
            return -1;
        }
        var residuo = (officeControl % 11);
        if (residuo > 1) {
            return (11 - residuo);
        }
        return 0;
    }
}
