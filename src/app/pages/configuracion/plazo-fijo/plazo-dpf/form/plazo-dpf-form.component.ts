import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { PlazoDPF, PlazoDPFService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/plazo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-plazo-dpf-form',
    templateUrl: './plazo-dpf-form.component.html',
    styleUrls: ['./plazo-dpf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PlazoDPFFormComponent extends FormBaseComponent implements OnInit {

    plazoDPF: PlazoDPF = {} as PlazoDPF;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private plazoDPFService: PlazoDPFService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.plazoDPFService.get(id).subscribe((agn: PlazoDPF) => {
                this.plazoDPF = agn;
                this.buildForm(this.plazoDPF);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.plazoDPF);
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

    buildForm(plazoDPF: PlazoDPF) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: plazoDPF.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(plazoDPF.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            dias: new FormControl(plazoDPF.dias || undefined, [Validators.required]),
            codigoLocal: new FormControl(plazoDPF.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.plazoDPF);
        this.saveOrUpdate(this.plazoDPFService, this.plazoDPF, 'El Plazo', this.isNew);
    }

    private codigoExists(id) {
        this.plazoDPFService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.plazoDPF.id) {
            this.applyChangeStatus(this.plazoDPFService, this.plazoDPF, this.plazoDPF.nombre, this.cdr);
        }
    }

}
