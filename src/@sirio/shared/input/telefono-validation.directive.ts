import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClaseTelefono } from 'src/@sirio/domain/services/configuracion/telefono/clase-telefono.service';
import { Telefonica } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';



export  function validatePhone(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
        

        return TelefonoValidator.validatePhone(control);
    }
}


@Directive({
    selector: '[phoneValidate],[phone-validate]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: TelefonoValidator, multi: true }
    ]
})
export class TelefonoValidator implements Validator {

    @Input('telefonicas') public telefonicas: Observable<Telefonica[]>;


    validate(control: AbstractControl): { [key: string]: string } | null {
        return validatePhone()(control);
    }

    public static validatePhone(control: AbstractControl): { [key: string]: string } | null {

        if (control.value == undefined) {
            return null;
        }

        var numero = control.value.split(' ').join('');

        console.log('numero telefono ',numero);
        
       

        return null;

    }

}
