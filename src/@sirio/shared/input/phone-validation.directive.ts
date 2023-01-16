import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { Observable } from 'rxjs';
import { Telefonica } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';





@Directive({
    selector: '[phoneValidate],[phone-validate]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: TelefonoValidator, multi: true }
    ]
})
export class TelefonoValidator implements Validator {

    private codigos:string[];
    // @Input('telefonicas') telefonicas: Observable<Telefonica[]>;

    constructor(private cdr:ChangeDetectorRef) {
    }
    
    @Input('telefonicas')
    set observe(source: Observable<Telefonica[]>) {
        if (!source) {
            return
        }
        source.subscribe(data => {
             this.codigos = data.map(t => t.id);
        });
    }


    validate(c: FormControl): ValidationErrors | null {
        return this.validatePhone(c);
    }


    private validatePhone(control: FormControl): ValidationErrors | null {

        if (control.value == undefined || control.value == '') {
            return null;
        }

        // console.log('codigos',this.codigos);
        
        let num = control.value;

        if(num.length < 4){
            return null;
        }

        // console.log(num);
        
        if (this.codigos.length > 0 && !this.codigos.includes(num.substring(0,4))) {
            return { phone: 'Prefijo telefónico errado' };
        }


        return null;

    }

}
