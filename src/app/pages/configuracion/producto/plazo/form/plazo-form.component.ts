import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Plazo, PlazoService } from 'src/@sirio/domain/services/configuracion/producto/plazo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-plazo-form',
    templateUrl: './plazo-form.component.html',
    styleUrls: ['./plazo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PlazoFormComponent extends FormBaseComponent implements OnInit {

    plazo: Plazo = {} as Plazo;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private plazoService: PlazoService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.plazoService.get(id).subscribe((agn: Plazo) => {
                this.plazo = agn;
                this.buildForm(this.plazo);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.plazo);
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

    buildForm(plazo: Plazo) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: plazo.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(plazo.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            dias: new FormControl(plazo.dias || undefined, [Validators.required]),
            codigoLocal: new FormControl(plazo.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.plazo);
        this.saveOrUpdate(this.plazoService, this.plazo, 'El Plazo', this.isNew);
    }

    private codigoExists(id) {
        this.plazoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.plazo.id) {
            this.applyChangeStatus(this.plazoService, this.plazo, this.plazo.nombre, this.cdr);
        }
    }

}
