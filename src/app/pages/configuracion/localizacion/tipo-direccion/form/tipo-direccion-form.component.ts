import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TipoDireccion, TipoDireccionService } from 'src/@sirio/domain/services/configuracion/localizacion/tipo-direccion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-direccion-form',
    templateUrl: './tipo-direccion-form.component.html',
    styleUrls: ['./tipo-direccion-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoDireccionFormComponent extends FormBaseComponent implements OnInit {

    tipoDireccion: TipoDireccion = {} as TipoDireccion;


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoDireccionService: TipoDireccionService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoDireccionService.get(id).subscribe((agn: TipoDireccion) => {
                this.tipoDireccion = agn;
                this.buildForm(this.tipoDireccion);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoDireccion);
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

    buildForm(tipoDireccion: TipoDireccion) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoDireccion.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(tipoDireccion.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoDireccion);
        this.saveOrUpdate(this.tipoDireccionService, this.tipoDireccion, 'El Tipo de Dirección', this.isNew);
    }

    private codigoExists(id) {
        this.tipoDireccionService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoDireccion.id) {
            this.applyChangeStatus(this.tipoDireccionService, this.tipoDireccion, this.tipoDireccion.nombre, this.cdr);
        }
    }

}
