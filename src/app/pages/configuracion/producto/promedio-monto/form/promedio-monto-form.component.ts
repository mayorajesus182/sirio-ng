import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { PromedioMonto, PromedioMontoService } from 'src/@sirio/domain/services/configuracion/producto/promedio-monto.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-promedio-monto-form',
    templateUrl: './promedio-monto-form.component.html',
    styleUrls: ['./promedio-monto-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PromedioMontoFormComponent extends FormBaseComponent implements OnInit {

    promedioMonto: PromedioMonto = {} as PromedioMonto;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private promedioMontoService: PromedioMontoService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.promedioMontoService.get(id).subscribe((agn: PromedioMonto) => {
                this.promedioMonto = agn;
                this.buildForm(this.promedioMonto);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.promedioMonto);
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

    buildForm(promedioMonto: PromedioMonto) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: promedioMonto.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(promedioMonto.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(promedioMonto.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.promedioMonto);
        this.saveOrUpdate(this.promedioMontoService, this.promedioMonto, 'El Promedio del Monto', this.isNew);
    }

    private codigoExists(id) {
        this.promedioMontoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.promedioMonto.id) {
            this.applyChangeStatus(this.promedioMontoService, this.promedioMonto, this.promedioMonto.nombre, this.cdr);
        }
    }

}
