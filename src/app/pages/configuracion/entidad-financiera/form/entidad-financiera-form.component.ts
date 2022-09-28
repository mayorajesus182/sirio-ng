import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { EntidadFinanciera, EntidadFinancieraService } from 'src/@sirio/domain/services/configuracion/entidad-financiera.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-entidad-financiera-form',
    templateUrl: './entidad-financiera-form.component.html',
    styleUrls: ['./entidad-financiera-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EntidadFinancieraFormComponent extends FormBaseComponent implements OnInit {

    entidadFinanciera: EntidadFinanciera = {} as EntidadFinanciera;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private entidadFinancieraService: EntidadFinancieraService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.entidadFinancieraService.get(id).subscribe((agn: EntidadFinanciera) => {
                this.entidadFinanciera = agn;
                this.buildForm(this.entidadFinanciera);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.entidadFinanciera);
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

    buildForm(entidadFinanciera: EntidadFinanciera) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: entidadFinanciera.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(entidadFinanciera.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(entidadFinanciera.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]), 
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.entidadFinanciera);
        this.saveOrUpdate(this.entidadFinancieraService, this.entidadFinanciera, 'El Estatus de Persona', this.isNew);
    }

    private codigoExists(id) {
        this.entidadFinancieraService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.entidadFinanciera.id) {
            this.applyChangeStatus(this.entidadFinancieraService, this.entidadFinanciera, this.entidadFinanciera.nombre, this.cdr);
        }
    }

}
