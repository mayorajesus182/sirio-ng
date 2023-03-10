import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { GestionEfectivoConstants } from 'src/@sirio/constants/gestion-efectivo.constants';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { CajaTaquilla, CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-pase-boveda-form',
    templateUrl: './pase-boveda-form.component.html',
    styleUrls: ['./pase-boveda-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseABovedaFormComponent extends FormBaseComponent implements OnInit {

    movimientoEfectivo: MovimientoEfectivo = {} as MovimientoEfectivo;
    taquilla: Taquilla = {} as Taquilla;
    cajaTaquilla: CajaTaquilla = {} as CajaTaquilla;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public preferencia: Preferencia;
    public conoSave: ConoMonetario[] = [];
    saldoDisponible: number = 0;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private cajaTaquillaService: CajaTaquillaService,
        private movimientoEfectivoService: MovimientoEfectivoService,
        private monedaService: MonedaService,
        private taquillaService: TaquillaService,
        private saldoTaquillaService: SaldoTaquillaService,
        private conoMonetarioService: ConoMonetarioService,
        private preferenciaService: PreferenciaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.cajaTaquillaService.get(id).subscribe((agn: CajaTaquilla) => {
                this.cajaTaquilla = agn;
                this.buildForm(this.cajaTaquilla);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {

            this.preferenciaService.active().subscribe(data => {
                this.preferencia = data;
                this.buildForm(this.cajaTaquilla);
                this.loadingDataForm.next(false);

                this.saldoTaquillaService.activesWithDisponibleSaldoTaquillaByMoneda(this.preferencia.monedaConoActual.value).subscribe(data => {
                    this.obtenerSaldo();
                    this.conos.next(data);
                    this.cdr.detectChanges();
                });
            });
            
        }

        this.monedaService.paraOperacionesActives().subscribe(data => {
            this.monedas.next(data);
        });

        this.movimientoEfectivoService.get(GestionEfectivoConstants.TAQUILLA_BOVEDA).subscribe(data => {
            this.movimientoEfectivo = data;
            this.cdr.detectChanges();
        });

        this.taquillaService.getByUsuario().subscribe(data => {
            this.taquilla = data;
            this.cdr.detectChanges();
        });
    }

    buildForm(cajaTaquilla: CajaTaquilla) {
        this.itemForm = this.fb.group({
            taquilla: new FormControl(''),
            movimientoEfectivo: new FormControl(''),
            moneda: new FormControl(cajaTaquilla.moneda || this.preferencia.monedaConoActual.value, Validators.required),
            monto: new FormControl(cajaTaquilla.monto || undefined, Validators.required),
        });

        this.f.moneda.valueChanges.subscribe(val => {
            this.obtenerSaldo();
            this.saldoTaquillaService.activesWithDisponibleSaldoTaquillaByMoneda(val).subscribe(data => {
                this.conos.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.monto.valueChanges.subscribe(val => {
            if (val) {
                this.validarBalance(val);
            }

        });
    }

    obtenerSaldo() {

        this.saldoDisponible = 0;
        this.f.monto.setValue(undefined);

        this.saldoTaquillaService.getSaldoByMoneda(this.f.moneda.value).subscribe(data => {
            this.saldoDisponible = data;
            this.validarBalance(this.f.monto.value);
        });
    }

    validarBalance(monto: number) {

        if (this.saldoDisponible < monto) {
            this.itemForm.controls['monto'].setErrors({
                balance: true
            });
            this.cdr.detectChanges();
        }
    }

    updateValuesErrors(item: ConoMonetario) {

        this.conos.subscribe(c => {
            this.f.monto.setValue(c.filter(c1 => c1.cantidad > 0).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
            this.conoSave = c.filter(c => c.cantidad > 0);
            this.cdr.detectChanges();
        });

        if (item.cantidad > item.disponible) {
            this.itemForm.controls['monto'].setErrors({
                cantidad: true
            });
            this.f.monto.setValue(0.0);
            this.cdr.detectChanges();
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cajaTaquilla);
        this.cajaTaquilla.taquilla = this.taquilla.id;
        this.cajaTaquilla.movimientoEfectivo = this.movimientoEfectivo.id;
        this.cajaTaquilla.detalleEfectivo = this.conoSave;

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        if (!existsDifference) {
            this.saveOrUpdate(this.cajaTaquillaService, this.cajaTaquilla, 'El Pase a B??veda', this.isNew);
        } else {

            this.swalService.show('Sobrepas?? una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });

        }
    }

}

