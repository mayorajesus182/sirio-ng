import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { MotivoSolicitud, MotivoSolicitudService } from 'src/@sirio/domain/services/configuracion/producto/motivo-solicitud.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-motivo-solicitud-form',
    templateUrl: './motivo-solicitud-form.component.html',
    styleUrls: ['./motivo-solicitud-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class MotivoSolicitudFormComponent extends FormBaseComponent implements OnInit {

    motivoSolicitud: MotivoSolicitud = {} as MotivoSolicitud;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private motivoSolicitudService: MotivoSolicitudService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.motivoSolicitudService.get(id).subscribe((agn: MotivoSolicitud) => {
                this.motivoSolicitud = agn;
                this.buildForm(this.motivoSolicitud);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.motivoSolicitud);
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

    buildForm(motivoSolicitud: MotivoSolicitud) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: motivoSolicitud.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(motivoSolicitud.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(motivoSolicitud.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.motivoSolicitud);
        this.saveOrUpdate(this.motivoSolicitudService, this.motivoSolicitud, 'El Motivo de Solicitud', this.isNew);
    }

    private codigoExists(id) {
        this.motivoSolicitudService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.motivoSolicitud.id) {
            this.applyChangeStatus(this.motivoSolicitudService, this.motivoSolicitud, this.motivoSolicitud.nombre, this.cdr);
        }
    }

}
