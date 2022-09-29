import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { EstatusPersona, EstatusPersonaService } from 'src/@sirio/domain/services/configuracion/estatus-persona.service';
import { SnackbarService } from 'src/@sirio/services/snackbar.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-estatus-persona-form',
    templateUrl: './estatus-persona-form.component.html',
    styleUrls: ['./estatus-persona-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EstatusPersonaFormComponent extends FormBaseComponent implements OnInit {

    estatusPersona: EstatusPersona = {} as EstatusPersona;


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private estatusPersonaService: EstatusPersonaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.estatusPersonaService.get(id).subscribe((agn: EstatusPersona) => {
                this.estatusPersona = agn;
                this.buildForm(this.estatusPersona);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.estatusPersona);
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

    buildForm(estatusPersona: EstatusPersona) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: estatusPersona.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(estatusPersona.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.estatusPersona);
        this.saveOrUpdate(this.estatusPersonaService, this.estatusPersona, 'El Estatus de Persona', this.isNew);
    }

    private codigoExists(id) {
        this.estatusPersonaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.estatusPersona.id) {
            this.applyChangeStatus(this.estatusPersonaService, this.estatusPersona, this.estatusPersona.nombre, this.cdr);
        }
    }

}
