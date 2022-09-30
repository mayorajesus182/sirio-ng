import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { MotivoDevolucion, MotivoDevolucionService } from 'src/@sirio/domain/services/configuracion/taquilla/motivo-devolucion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-motivo-devolucion-form',
    templateUrl: './motivo-devolucion-form.component.html',
    styleUrls: ['./motivo-devolucion-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class MotivoDevolucionFormComponent extends FormBaseComponent implements OnInit {

    motivoDevolucion: MotivoDevolucion = {} as MotivoDevolucion;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private motivoDevolucionService: MotivoDevolucionService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.motivoDevolucionService.get(id).subscribe((agn: MotivoDevolucion) => {
                this.motivoDevolucion = agn;
                this.buildForm(this.motivoDevolucion);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.motivoDevolucion);
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

    buildForm(motivoDevolucion: MotivoDevolucion) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: motivoDevolucion.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(motivoDevolucion.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(motivoDevolucion.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.motivoDevolucion);
        this.saveOrUpdate(this.motivoDevolucionService, this.motivoDevolucion, 'El Motivo de Devolucion', this.isNew);
    }

    private codigoExists(id) {
        this.motivoDevolucionService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.motivoDevolucion.id) {
            this.applyChangeStatus(this.motivoDevolucionService, this.motivoDevolucion, this.motivoDevolucion.nombre, this.cdr);
        }
    }

}
