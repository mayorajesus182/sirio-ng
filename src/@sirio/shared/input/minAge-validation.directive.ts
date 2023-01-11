import { Directive, ElementRef, Input } from "@angular/core";
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { Moment } from "moment";

import * as _moment from 'moment';

const moment = _moment;

@Directive({
    selector: '[minorAge],[minor-age]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: MinorAgeValidator, multi: true }
    ]
})
export class MinorAgeValidator implements Validator {

    @Input('today') today: Moment;

    constructor(private element: ElementRef) { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validateAge(c);
    }


    private validateAge(control: FormControl): ValidationErrors | null {

        if (control.value == undefined || control.value == '') {
            return null;
        }

        let birthday = control.value;

        // console.log('min age today ',this.today);
        


        let age = moment.duration(moment(this.today).diff(birthday)).asYears();

        if (age < 18) {
            return { minAge: 'Debe ser mayor de edad'};
        }

        return null;
    }

}
