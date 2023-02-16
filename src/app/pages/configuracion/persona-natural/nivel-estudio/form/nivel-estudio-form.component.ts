import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { NivelEstudio, NivelEstudioService } from 'src/@sirio/domain/services/configuracion/persona-natural/nivel-estudio.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-nivel-estudio-form',
    templateUrl: './nivel-estudio-form.component.html',
    styleUrls: ['./nivel-estudio-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NivelEstudioFormComponent extends FormBaseComponent implements OnInit {

    nivelEstudio: NivelEstudio = {} as NivelEstudio;
    
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private nivelEstudioService: NivelEstudioService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.nivelEstudioService.get(id).subscribe((agn: NivelEstudio) => {
                this.nivelEstudio = agn;
                this.buildForm(this.nivelEstudio);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.nivelEstudio);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

    }

    buildForm(nivelEstudio: NivelEstudio) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: nivelEstudio.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(nivelEstudio.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(nivelEstudio.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.nivelEstudio);
        this.saveOrUpdate(this.nivelEstudioService, this.nivelEstudio, 'El Nivel de Estudio', this.isNew);
    }

    private codigoExists(id) {
        this.nivelEstudioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.nivelEstudio.id) {
            this.applyChangeStatus(this.nivelEstudioService, this.nivelEstudio, this.nivelEstudio.nombre, this.cdr);
        }
    }

}
