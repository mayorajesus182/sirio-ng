import { Directive } from "@angular/core";
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
    selector: '[validatePorcentage][formControlName],[validatePorcentage][formControl],[validatePorcentage][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: PorcentajeValidator, multi: true }
    ]
})

export class PorcentajeValidator implements Validator {

    constructor() { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validatePorcentaje(c);
    }


    private validatePorcentaje(control: FormControl): ValidationErrors | null {

        if (control.value === undefined) {
            return null;
        }

        var porcentaje = control.value;

        if (isNaN(porcentaje)) {
            return { percentage: 'Porcentaje inválido' };
        }

        if ((porcentaje < 0) || (porcentaje > 100)) {
            return { percentage: 'Debe estar entre 0 y 100' };
        }

        return null;

    }

}
