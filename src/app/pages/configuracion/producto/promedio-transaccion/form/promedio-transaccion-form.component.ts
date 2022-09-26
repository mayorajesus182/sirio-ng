import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { PromedioTransaccion, PromedioTransaccionService } from 'src/@sirio/domain/services/configuracion/producto/promedio-transaccion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-promedio-transaccion-form',
    templateUrl: './promedio-transaccion-form.component.html',
    styleUrls: ['./promedio-transaccion-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PromedioTransaccionFormComponent extends FormBaseComponent implements OnInit {

    promedioTransaccion: PromedioTransaccion = {} as PromedioTransaccion;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private promedioTransaccionService: PromedioTransaccionService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.promedioTransaccionService.get(id).subscribe((agn: PromedioTransaccion) => {
                this.promedioTransaccion = agn;
                this.buildForm(this.promedioTransaccion);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.promedioTransaccion);
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

    buildForm(promedioTransaccion: PromedioTransaccion) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: promedioTransaccion.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(promedioTransaccion.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(promedioTransaccion.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.promedioTransaccion);
        this.saveOrUpdate(this.promedioTransaccionService, this.promedioTransaccion, 'El Promedio de Transacción', this.isNew);
    }

    private codigoExists(id) {
        this.promedioTransaccionService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.promedioTransaccion.id) {
            this.applyChangeStatus(this.promedioTransaccionService, this.promedioTransaccion, this.promedioTransaccion.nombre, this.cdr);
        }
    }

}
