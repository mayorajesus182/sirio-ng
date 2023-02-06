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

    private typesMinor=['M','N'];

    constructor(private element: ElementRef) { }

    validate(c: FormControl): ValidationErrors | null {
        return this.validateAge(c);
    }


    private validateAge(control: FormControl): ValidationErrors | null {

        if (control.value == undefined || control.value == '') {
            return null;
        }

        let birthday = control.value;
        // console.log(moment.duration(moment(this.today).diff(birthday)).asYears());
        
        let ageCalc =Math.round(moment.duration(moment(this.today).diff(birthday)).asYears()) ;

        // console.log(ageCalc);
        

        if (ageCalc > 18 && this.typesMinor.includes(this.document.charAt(0)) ) {
            return { age: 'Debe ser menor de edad'};
        }

        if (ageCalc <= 18 && !this.typesMinor.includes(this.document.charAt(0))) {
            return { age: 'Debe ser mayor de edad'};
        }

        return null;
    }

}
