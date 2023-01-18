import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { ServicioComercialService } from 'src/@sirio/domain/services/gestion-comercial/servicio-comercial.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-moneda-form',
    templateUrl: './moneda-form.component.html',
    styleUrls: ['./moneda-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class MonedaFormComponent extends FormBaseComponent implements OnInit {

    moneda: Moneda = {} as Moneda;
    existeCono: Boolean = true;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private monedaService: MonedaService,
        private conoMonetarioService: ConoMonetarioService,
        private servicioComercialService: ServicioComercialService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {

            this.conoMonetarioService.existsSomethingByMoneda(id).subscribe(result => {
                this.existeCono = result.exists;
            });

            this.monedaService.get(id).subscribe((agn: Moneda) => {
                this.moneda = agn;
                this.buildForm(this.moneda);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.moneda);
            this.loadingDataForm.next(false);
        }

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }

    buildForm(moneda: Moneda) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: moneda.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            siglas: new FormControl(moneda.siglas || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(moneda.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            usoOperacion: new FormControl(moneda.usoOperacion || false),
            usoAtm: new FormControl(moneda.usoAtm || false),
            esVirtual: new FormControl(moneda.esVirtual || false),
            codigoLocal: new FormControl(moneda.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    private codigoExists(id) {
        this.monedaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.moneda);

        if ((this.moneda.usoOperacion || this.moneda.usoAtm) && (!this.existeCono)) {
            this.swalService.show('No Puede Guardar la Moneda', 'Si desea usarla en Operaciones o ATM, debe crear el Cono Monetario de la Misma', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });
        } else {
            this.moneda.usoOperacion = this.moneda.usoOperacion ? 1 : 0;
            this.moneda.usoAtm = this.moneda.usoAtm ? 1 : 0;
            this.moneda.esVirtual = this.moneda.esVirtual ? 1 : 0;

            this.saveOrUpdate(this.monedaService, this.moneda, 'La  Moneda', this.isNew);
        }
    }

    activateOrInactivate() {
        if (this.moneda.id) {
            this.applyChangeStatus(this.monedaService, this.moneda, this.moneda.nombre, this.cdr);
        }
    }

}
