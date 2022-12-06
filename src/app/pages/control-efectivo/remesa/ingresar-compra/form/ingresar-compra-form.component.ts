import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { MovimientoEfectivo } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { CompraRemesa, RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-ingresar-compra-form',
    templateUrl: './ingresar-compra-form.component.html',
    styleUrls: ['./ingresar-compra-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class IngresarCompraBcvFormComponent extends FormBaseComponent implements OnInit {

    compraRemesa: CompraRemesa = {} as CompraRemesa;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public conoSave: ConoMonetario[] = [];
    saldoDisponible: number = 0;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private remesaService: RemesaService,
        private monedaService: MonedaService,
        private conoMonetarioService: ConoMonetarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    // TODO: AGREGAR ETIQUETAS FALTANTES EN EL HTML (desglose de efectivo)

    ngOnInit() {

        this.isNew = true;
        this.loadingDataForm.next(true);
        this.buildForm();
        this.loadingDataForm.next(false);

        this.monedaService.fisicaActives().subscribe(data => {
            this.monedas.next(data);
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            moneda: new FormControl(undefined, Validators.required),
            monto: new FormControl(undefined, Validators.required),
        });

        this.f.moneda.valueChanges.subscribe(val => {
            this.conoMonetarioService.activesByMoneda(val).subscribe(data => {
                this.conos.next(data);
                this.cdr.detectChanges();
            });
        });

    }

    updateValuesErrors(item: ConoMonetario) {

        this.conos.subscribe(c => {
            this.f.monto.setValue(c.filter(c1 => c1.cantidad > 0).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
            this.conoSave = c.filter(c => c.cantidad > 0);
        });

    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.compraRemesa);
        this.compraRemesa.detalleEfectivo = this.conoSave;


        this.remesaService.ingresoCompraCreate(this.compraRemesa).subscribe(data => {
            this.itemForm.reset({});
            this.successResponse('La Remesa', 'Procesada', false);
            return data;
        }, error => this.errorResponse(true));

    }

}

