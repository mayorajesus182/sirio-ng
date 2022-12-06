import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
    selector: 'app-cupo-agencia-popup',
    templateUrl: './cupo-agencia-popup.component.html',
    styleUrls: ['./cupo-agencia-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CupoAgenciaPopupComponent extends PopupBaseComponent implements OnInit {

    public monedas = new BehaviorSubject<Moneda[]>([]);
    cupoAgencia: CupoAgencia = {} as CupoAgencia;
    transportista: string;


    constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
        protected injector: Injector,
        private cupoAgenciaservice: CupoAgenciaService,
        private monedaService: MonedaService,
        private cdr: ChangeDetectorRef,
        dialogRef: MatDialogRef<CupoAgenciaPopupComponent>,
        private fb: FormBuilder) {

        super(dialogRef, injector)
    }

    ngOnInit() {
        this.cupoAgencia = this.defaults.payload;

        if (this.cupoAgencia.moneda) {
            this.mode = 'global.edit';
        } else {
            this.defaults = {} as any;
        }      

        this.buildForm()

        this.monedaService.fisicaActives().subscribe(data => {
            this.monedas.next(data);
            this.cdr.detectChanges();
        });

        if (!this.cupoAgencia.moneda) {
            this.f.moneda.valueChanges.subscribe(value => {
                this.codigoExists(value);
            });
        }

    }

    buildForm() {

        this.itemForm = this.fb.group({
            moneda: new FormControl({ value: this.cupoAgencia.moneda || undefined, disabled: !this.isNew }, [Validators.required]),
            maximo: new FormControl(this.cupoAgencia.maximo || undefined),
            minimo: new FormControl(this.cupoAgencia.minimo || undefined),
            excedente: new FormControl(this.cupoAgencia.excedente || undefined),
            excedentePorcentual: new FormControl(this.cupoAgencia.excedentePorcentual || false),
        });
    }

    private codigoExists(moneda) {
        this.cupoAgenciaservice.exists(this.cupoAgencia.agencia, moneda).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['moneda'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cupoAgencia);
        this.cupoAgencia.excedentePorcentual = this.cupoAgencia.excedentePorcentual ? 1 : 0;
        this.saveOrUpdate(this.cupoAgenciaservice, this.cupoAgencia, 'El Cupo', this.isNew);
    }

}
