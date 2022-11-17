import { ValidationErrors, FormControl, Validator, NG_VALIDATORS, NgControl, AbstractControl } from '@angular/forms';
import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[validRifNumber],[valid-rif-number]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: RifValidator, multi: true }
    ]
})
export class RifValidator implements Validator {


    validate(c: FormControl): ValidationErrors | null {
        return RifValidator.validateRifNumber(c);
    }

    static validateRif = (tipoPersona?: string) => {

        return (control: FormControl) => {

            return RifValidator.validateRifNumber(control, tipoPersona);
        }
    }

    private static validateRifNumber(control: FormControl, tipoPerona?: string): ValidationErrors | Boolean {
        
        if (control.value == undefined) {
            return false;
        }

        var TYPE = {
            "V": "1",
            "E": "2",
            "J": "3",
            "C": "3",
            "P": "4",
            "G": "5"
        };



        var modelValue = control.value.toUpperCase();

        var res = modelValue.charAt(0);

        if (!TYPE[res]) {
            return { rif: 'El valor no representa una estructura de RIF, deben comenzar con J,V,E,G,P o C' };
        }

        if (modelValue.indexOf('-') >= 0) {
            return { rif: 'El valor no representa una estructura de RIF, este no debe tener el caracter del guión(-)' };
        }

        let rif = modelValue;
        /*if (rif.trim() === '' || rif.trim().length === 0) {
            return { rif: 'El valor no representa una estructura de RIF, este no debe tener el caracter del guión(-)' };
        }*/
        var t = rif.charAt(0);

        if (tipoPerona !== undefined) {

            if (tipoPerona === 'NAT' && (t === 'J' || t === 'G' || t === 'C')) {
                return { rif: 'El valor suministrado es inválido no pertenece al tipo de persona natural' };
            } else if (tipoPerona === 'JUR' && (t === 'V' || t === 'E' || t === 'P')) {
                return { rif: 'El valor suministrado es inválido no pertenece al tipo de persona jurídica' };
            }
        }

        if (rif.length != 10) {
            return { rif: 'El valor no representa una estructura de RIF, su longitud debe ser de diez(10) caracteres' };
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
