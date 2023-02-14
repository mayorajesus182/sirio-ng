import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Nucleo, NucleoService } from 'src/@sirio/domain/services/configuracion/localizacion/nucleo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-nucleo-form',
    templateUrl: './nucleo-form.component.html',
    styleUrls: ['./nucleo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NucleoFormComponent extends FormBaseComponent implements OnInit {

    nucleo: Nucleo = {} as Nucleo;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private nucleoService: NucleoService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.nucleoService.get(id).subscribe((agn: Nucleo) => {
                this.nucleo = agn;
                this.buildForm(this.nucleo);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.nucleo);
            this.loadingDataForm.next(false);
        }

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }

    buildForm(nucleo: Nucleo) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: nucleo.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(nucleo.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(nucleo.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.nucleo);
        this.saveOrUpdate(this.nucleoService, this.nucleo, 'El Nucleo', this.isNew);
    }

    private codigoExists(id) {
        this.nucleoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.nucleo.id) {
            this.applyChangeStatus(this.nucleoService, this.nucleo, this.nucleo.nombre, this.cdr);
        }
    }

}
