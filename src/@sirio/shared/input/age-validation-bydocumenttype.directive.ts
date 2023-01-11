import { Directive, ElementRef, Input } from "@angular/core";
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { Moment } from "moment";

import * as _moment from 'moment';

const moment = _moment;

@Directive({
    selector: '[ageDocumentType],[age-document-type]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: AgeValidatorByDocumentType, multi: true }
    ]
})
export class AgeValidatorByDocumentType implements Validator {

    @Input('today') today: Moment;
    @Input('document') document: String;

    constructor(private element: ElementRef) { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validateAge(c);
    }


    private validateAge(control: FormControl): ValidationErrors | null {

        if (control.value == undefined || control.value == '') {
            return null;
        }

        let birthday = control.value;

        let ageCalc = moment.duration(moment(this.today).diff(birthday)).asYears();

        console.log('min age today ',this.today);
        console.log('document ', this.document.charAt(0));
        console.log('ageCalc ', ageCalc);

        if (ageCalc > 18 && this.document.charAt(0) === 'M') {
            return { age: 'Debe ser menor de edad'};
        }

        if (ageCalc < 18 && this.document.charAt(0) !== 'M') {
            return { age: 'Debe ser mayor de edad'};
        }

        return null;
    }

}
