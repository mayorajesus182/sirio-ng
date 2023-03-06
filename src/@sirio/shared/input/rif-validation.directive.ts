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

    private legal: string[] = ['J', 'G', 'C', 'W', 'I'];
    private natural: string[] = ['V', 'E', 'P', 'R', 'H'];

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



    private validateRifNumber(control: FormControl, tipoPerona?: string): ValidationErrors | Boolean {


        if (!this.tipoDocumento) {
            return { rif: 'Número de Documento Inválido' };
        }

        if (control.value == undefined || this.tipoDocumento=='W') {
            // la letra W supuestamente es rif provisional, no se validad
            return false;
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
            // "W": "3",
        };



        var modelValue = control.value;

        var t = this.tipoDocumento;//modelValue.charAt(0);

        if (!TYPE[t]) {
            control.markAsTouched();
            return { rif: 'Número de Documento Inválido' };
        }

        let rif = modelValue;

        if (tipoPerona !== undefined) {
            if (tipoPerona === 'NAT' && !this.legal.includes(t)) {
                control.markAsTouched();
                return { rif: 'Número de Documento Inválido' };
            } else if (tipoPerona === 'JUR' && !this.natural.includes(t)) {
                control.markAsTouched();
                return { rif: 'Número de Documento Inválido' };
            }
        }

        if (rif.length != 9) {
            return { rif: 'Número de Documento Inválido' };
        }

        rif = TYPE[t] + rif;
        var controlGen = RifValidator.getControlDigitsRif(rif);

        // console.log('RIF: ',t+ ' - '+ rif);
        // console.log('RIF: ',rif);


        if (controlGen < 0 || controlGen != rif.charAt(rif.length - 1)) {
            control.markAsTouched();
            return { rif: 'Número de Documento Inválido' };
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
