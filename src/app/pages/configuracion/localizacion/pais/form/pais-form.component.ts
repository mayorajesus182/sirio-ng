import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-pais-form',
    templateUrl: './pais-form.component.html',
    styleUrls: ['./pais-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaisFormComponent extends FormBaseComponent implements OnInit {

    pais: Pais = {} as Pais;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private paisService: PaisService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.paisService.get(id).subscribe((agn: Pais) => {
                this.pais = agn;
                this.buildForm(this.pais);
                this.loadingDataForm.next(false);
            });
        } else {
            this.buildForm(this.pais);
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

    buildForm(pais: Pais) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: pais.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(pais.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            gentilicio: new FormControl(pais.gentilicio || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(pais.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            prefijo: new FormControl(pais.prefijo || '', [Validators.pattern(RegularExpConstants.NUMERIC_PLUS_LESS)]),
        });
        this.printErrors();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.pais);
        this.saveOrUpdate(this.paisService, this.pais, 'El País', this.isNew);
    }

    private codigoExists(id) {
        this.paisService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.pais.id) {
            this.applyChangeStatus(this.paisService, this.pais, this.pais.nombre, this.cdr);
        }
    }

}
