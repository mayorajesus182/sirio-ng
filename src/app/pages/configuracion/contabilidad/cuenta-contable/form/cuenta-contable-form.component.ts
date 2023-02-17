import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { CuentaContable, CuentaContableService } from 'src/@sirio/domain/services/configuracion/contabilidad/cuenta-contable.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cuenta-contable-form',
    templateUrl: './cuenta-contable-form.component.html',
    styleUrls: ['./cuenta-contable-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CuentaContableFormComponent extends FormBaseComponent implements OnInit {

    cuentaContable: CuentaContable = {} as CuentaContable;


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private cuentaContableService: CuentaContableService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.cuentaContableService.get(id).subscribe((agn: CuentaContable) => {
                this.cuentaContable = agn;
                this.buildForm(this.cuentaContable);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.cuentaContable);
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

    buildForm(cuentaContable: CuentaContable) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: cuentaContable.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(cuentaContable.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cuentaContable);
        this.saveOrUpdate(this.cuentaContableService, this.cuentaContable, 'La Cuenta Contable', this.isNew);
    }

    private codigoExists(id) {
        this.cuentaContableService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.cuentaContable.id) {
            this.applyChangeStatus(this.cuentaContableService, this.cuentaContable, this.cuentaContable.nombre, this.cdr);
        }
    }

}
