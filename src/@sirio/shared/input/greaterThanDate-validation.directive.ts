import { ValidationErrors, FormControl, Validator, NG_VALIDATORS, NgControl, AbstractControl } from "@angular/forms";
import { Directive, ElementRef, Attribute, Input } from "@angular/core";
import { Moment } from "moment";

import * as _moment from 'moment';

const moment = _moment;

@Directive({
    selector: '[validateGreaterThanDate],validate-greaterthan-Date',
    providers: [
        { provide: NG_VALIDATORS, useExisting: GreaterThanDateValidator, multi: true }
    ]
})
export class GreaterThanDateValidator implements Validator {

    @Input('greaterThan') greaterThanValue: Moment;

    constructor(private element: ElementRef) { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validateDate(c);
    }


    private validateDate(control: FormControl): ValidationErrors | null {

        if (control.value == undefined || control.value == '') {
            return null;
        }
        
        let dateCurr: Moment = control.value;
        
        if (moment(dateCurr).isAfter(this.greaterThanValue)) {
            return { greaterThan: 'La fecha suministrada es mayor que ' + moment(this.greaterThanValue).format('DD/MM/YYYY') };
        }


        return null;

    }

}