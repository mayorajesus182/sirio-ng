import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'sirio-parametro-form',
    templateUrl: './parametro-form.component.html',
    styleUrls: ['./parametro-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ParametroFormComponent extends FormBaseComponent implements OnInit {

    preferencia: any[];
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

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        this.preferenciaService.get().subscribe(val => {
            if (val) {
                this.preferencia = val;
            }
        })

        this.itemForm = this.fb.group({});
        this.groups = Object.keys(this.preferencia)
        for (const key of this.groups) {
            for (const item of this.preferencia[key]) {
                const field = Object.keys(item)[0];
                this.itemForm.addControl(field, this.fb.control(item[field].value, [Validators.required]));
            }

        }

    }

    getField(item: any) {
        return Object.keys(item)[0];
    }
    // buildForm() {

    //     this.itemForm = this.fb.group({
    //         // id: [{value: preferencia.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
    //         // nombre: [preferencia.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]],
    //         // icono: [preferencia.icono || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]],
    //     });

    //     this.printErrors()
    // }

    save() {
        if (this.itemForm.invalid)
            return;

        // this.updateData(this.preferencia);
        // this.saveOrUpdate(this.preferenciaService, this.preferencia, 'ElPreferencia', this.isNew);
    }


}
