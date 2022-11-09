import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { MovimientoEfectivoConstants } from 'src/@sirio/constants/movimiento.efectivo.constants';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { BovedaAgencia, BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { Atm, AtmService } from 'src/@sirio/domain/services/organizacion/atm.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-pase-efectivo-form',
    templateUrl: './pase-efectivo-form.component.html',
    styleUrls: ['./pase-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseEfectivoFormComponent extends FormBaseComponent implements OnInit {

    bovedaAgencia: BovedaAgencia = {} as BovedaAgencia;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public atms = new BehaviorSubject<Atm[]>([]);
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    saldoDisponible: number = 0;
    movimiento = MovimientoEfectivoConstants;
    atmSeleccionado: Atm = {} as Atm;
    monedaAtm: Moneda = {} as Moneda;
    public conoSave: ConoMonetario[] = [];

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private bovedaAgenciaService: BovedaAgenciaService,
        private movimientoEfectivoService: MovimientoEfectivoService,
        private saldoTaquillaService: SaldoTaquillaService,
        private saldoAgenciaService: SaldoAgenciaService,
        private monedaService: MonedaService,
        private taquillaService: TaquillaService,
        private atmService: AtmService,
        private conoMonetarioService: ConoMonetarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    // TODO: AGREGAR ETIQUETAS FALTANTES EN EL HTML (desglose de efectivo)

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.bovedaAgenciaService.get(id).subscribe((agn: BovedaAgencia) => {
                this.bovedaAgencia = agn;
                this.buildForm(this.bovedaAgencia);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.bovedaAgencia);
            this.loadingDataForm.next(false);
        }

        this.movimientoEfectivoService.all().subscribe(data => {
            this.movimientos.next(data);
        });

        this.taquillaService.activesWithUser().subscribe(data => {
            this.taquillas.next(data);
        });

        this.monedaService.paraOperacionesActives().subscribe(data => {
            this.monedas.next(data);
        });

        this.atmService.actives().subscribe(data => {
            this.atms.next(data);
        });
    }

    buildForm(bovedaAgencia: BovedaAgencia) {
        this.itemForm = this.fb.group({
            movimientoEfectivo: new FormControl(bovedaAgencia.movimientoEfectivo || undefined, Validators.required),
            taquilla: new FormControl(bovedaAgencia.taquilla || undefined),
            atm: new FormControl(bovedaAgencia.atm || undefined),
            moneda: new FormControl(bovedaAgencia.moneda || undefined, Validators.required),
            monto: new FormControl(bovedaAgencia.monto || undefined, Validators.required),
        });

        this.f.movimientoEfectivo.valueChanges.subscribe(val => {
            this.f.taquilla.setValue(undefined);
            this.f.atm.setValue(undefined);
            this.f.moneda.setValue(undefined);
            this.f.taquilla.setErrors(undefined);
            this.f.atm.setErrors(undefined);
            this.f.moneda.setErrors(undefined);
            this.monedaAtm = { nombre: '' } as Moneda;
            this.obtenerSaldo();
            this.cdr.detectChanges();
        });

        this.f.taquilla.valueChanges.subscribe(val => {
            if (val) {
                this.obtenerSaldo();
            }
        });

        this.f.atm.valueChanges.subscribe(val => {
            if (val) {
                this.atmSeleccionado = this.atms.value.filter(e => e.id == val)[0] as Atm;
                this.monedaAtm = this.monedas.value.filter(e => e.id == this.atmSeleccionado.moneda)[0] as Moneda;
                this.f.moneda.setValue(this.atmSeleccionado.moneda);
                this.obtenerSaldo();
            }
        });

        this.f.moneda.valueChanges.subscribe(val => {
            if (val) {
                this.obtenerSaldo();
                this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByMoneda(val).subscribe(data => {
                    this.conos.next(data);
                    this.cdr.detectChanges();
                });
            }
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

        if (this.f.movimientoEfectivo.value !== MovimientoEfectivoConstants.ATM_BOVEDA) {

            if (this.f.movimientoEfectivo.value !== undefined &&
                this.f.moneda.value !== undefined &&
                (this.f.taquilla.value !== undefined || this.f.atm.value !== undefined)) {

                if (this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.BOVEDA_TAQUILLA ||
                    this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.BOVEDA_ATM) {

                    this.saldoAgenciaService.getSaldoByMoneda(this.f.moneda.value).subscribe(data => {
                        this.saldoDisponible = data;
                        this.validarBalance(this.f.monto.value);
                        this.cdr.detectChanges();
                    });

                } else if (this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.TAQUILLA_BOVEDA) {

                    this.saldoTaquillaService.getSaldoByMonedaAndTaquilla(this.f.moneda.value, this.f.taquilla.value).subscribe(data => {
                        this.saldoDisponible = data;
                        this.validarBalance(this.f.monto.value);
                        this.cdr.detectChanges();

                    });

                }
            }
        } else {
            this.cdr.detectChanges();
        }

    }

    validarBalance(monto: number) {
        if (this.f.movimientoEfectivo.value !== MovimientoEfectivoConstants.ATM_BOVEDA) {
            if (this.saldoDisponible < monto) {
                this.itemForm.controls['monto'].setErrors({
                    balance: true
                });
                this.cdr.detectChanges();
            }
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
        this.updateData(this.bovedaAgencia);
        this.bovedaAgencia.detalleEfectivo = this.conoSave;

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        if (!existsDifference) {
            this.saveOrUpdate(this.bovedaAgenciaService, this.bovedaAgencia, 'El Pase de Efectivo', this.isNew);
        } else {

            this.swalService.show('Sobrepasó una de las Cantidades Disponibles', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });

        }
    }

}
