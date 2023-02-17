import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoIngreso, TipoIngresoService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-ingreso.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-ingreso-form',
    templateUrl: './tipo-ingreso-form.component.html',
    styleUrls: ['./tipo-ingreso-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoIngresoFormComponent extends FormBaseComponent implements OnInit {

    tipoIngreso: TipoIngreso = {} as TipoIngreso;
    
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoIngresoService: TipoIngresoService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoIngresoService.get(id).subscribe((agn: TipoIngreso) => {
                this.tipoIngreso = agn;
                this.buildForm(this.tipoIngreso);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoIngreso);
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

    buildForm(tipoIngreso: TipoIngreso) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoIngreso.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(tipoIngreso.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(tipoIngreso.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoIngreso);
        this.saveOrUpdate(this.tipoIngresoService, this.tipoIngreso, 'La Actividad Economica', this.isNew);
    }

    private codigoExists(id) {
        this.tipoIngresoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoIngreso.id) {
            this.applyChangeStatus(this.tipoIngresoService, this.tipoIngreso, this.tipoIngreso.nombre, this.cdr);
        }
    }

}
