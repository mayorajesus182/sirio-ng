import { Directive, Input } from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';



export function validateAccount(procedencia: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
        console.log('cuenta',control.value);

        return NumAccountValidator.validateCuentaNumber(control, procedencia);
    }
}


@Directive({
    selector: '[numAccountValidate],[num-account-validate]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: NumAccountValidator, multi: true }
    ]
})
export class NumAccountValidator implements Validator {

    @Input('procedencia') procedencia: string;


    validate(control: AbstractControl): { [key: string]: string } | null {
        return validateAccount(this.procedencia)(control);
    }



    public static validateCuentaNumber(control: AbstractControl, procendecia: string): { [key: string]: string } | null {

        if (control.value == undefined) {
            return null;
        }

        var cuenta = control.value.split(' ').join('');
        
        console.log('procedencia', procendecia);
        if (!procendecia || procendecia.length == 0) {
            return { notbank: 'Debe seleccionar primero el banco' };
        }


        if (procendecia === 'N' && cuenta.length !== 20) {

            return { account: 'Debe tener veinte (20) dígitos' };
        }

        if (procendecia === 'N' && cuenta.substring(10, 20) === '0000000000') {

            return { account: 'Debe tener veinte (20) dígitos' };
        }

        if (procendecia === 'N') {
            var cc1 = cuenta.substring(0, 4);
            var cc2 = cuenta.substring(4, 8);
            var cc3 = cuenta.substring(8, 10);
            var cc4 = cuenta.substring(10, 20);
            var IentOfi = cc1 + cc2;
            var InumCta = cc2 + cc4;
            var value1 = NumAccountValidator.getControlDigitsCodCCliente(IentOfi, InumCta);
            var value2 = cc3;
            //ctrl.$setValidity('cuenta', value1 == value2);
            //console.log('value1 **'+value1+'** value2 **'+value2+'***');

            if (value1 != value2) {
                return { account: 'Número verificador inválido' };
            }
        }

        return null;

    }

    private static getControlDigitsCodCCliente(office, account) {
        var OFFICE_LENGTH = 8;
        var ACCOUNT_LENGTH = 14;
        var WEIGHTS = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3];
        var officeControl = 0;
        var accountControl = 0;
        for (var i = 0; i < OFFICE_LENGTH; i++) {
            var digit = office.charAt(OFFICE_LENGTH - 1 - i);
            officeControl += eval("digit * WEIGHTS[" + i + "]");
        }
        var remainder = officeControl % 11;
        officeControl = 11 - remainder;
        if (officeControl == 10) {
            officeControl = 0;
        }
        if (officeControl == 11) {
            officeControl = 1;
        }
        for (var j = 0; j < ACCOUNT_LENGTH; j++) {
            digit = account.charAt(ACCOUNT_LENGTH - 1 - j);
            accountControl += eval("digit * WEIGHTS[" + j + "]");
        }
        remainder = accountControl % 11;
        accountControl = 11 - remainder;
        if (accountControl == 10) {
            accountControl = 0;
        }
        if (accountControl == 11) {
            accountControl = 1;
        }
        return officeControl * 10 + accountControl;
    }
}
