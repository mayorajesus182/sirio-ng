import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'sirio-parametro-form',
    templateUrl: './parametro-form.component.html',
    styleUrls: ['./parametro-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ParametroFormComponent extends FormBaseComponent implements OnInit {

    preferencia: Preferencia;
    groups = undefined;
    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private preferenciaService: PreferenciaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.isNew == undefined;
        this.loadingDataForm.next(true);

        this.preferenciaService.get().subscribe(val => {
            if (val) {
                this.preferencia = val;
                this.itemForm = this.fb.group({});
                this.groups = Object.keys(this.preferencia)
                for (const key of this.groups) {

                    // console.log(label);
                    // console.log(icono);
                    for (const item of this.preferencia[key]) {
                        const field = Object.keys(item)[0];
                        this.itemForm.addControl(field, this.fb.control(item[field].value));
                    }
                }
                this.cdr.detectChanges();
            }
        })


    }

    getLabel(key) {
        const label = key.split(':')[0];
        return label;
    }

    getIcono(key) {
        const icono = key.split(':')[1];
        return icono;
    }

    getField(item: any) {
        return Object.keys(item)[0];
    }

    save() {
        if (this.itemForm.invalid)
            return;
        console.log("itemForm", this.itemForm.value);
        this.saveOrUpdate(this.preferenciaService, this.itemForm.value, 'La Preferencia', false);
    }
}