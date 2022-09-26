import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
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


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private monedaService: MonedaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.monedaService.get(id).subscribe((agn: Moneda) => {
                this.moneda = agn;
                this.buildForm(this.moneda);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.moneda);
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

    buildForm(moneda: Moneda) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: moneda.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(moneda.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            //esVirtual: new FormControl(moneda.esVirtual || 0),
            esVirtual: new FormControl(moneda.esVirtual || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            codigoLocal: new FormControl(moneda.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.moneda);
        this.moneda.esVirtual = this.moneda.esVirtual ? 1 : 0;
        this.saveOrUpdate(this.monedaService, this.moneda, 'La  Moneda', this.isNew);
       
       
    }

    private codigoExists(id) {
        this.monedaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.moneda.id) {
            this.applyChangeStatus(this.monedaService, this.moneda, this.moneda.nombre, this.cdr);
        }
    }

}
