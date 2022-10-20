import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { MovimientoEfectivoConstants } from 'src/@sirio/constants/movimiento.efectivo.constants';
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
    saldoDisponible: number = 0;
    movimiento: MovimientoEfectivoConstants = MovimientoEfectivoConstants;

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
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }


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

        this.monedaService.actives().subscribe(data => {
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

        this.f.movimientoEfectivo.valueChanges.subscribe(value => {
            this.f.taquilla.setValue(undefined);
            this.f.atm.setValue(undefined);
            this.cdr.detectChanges();
            this.obtenerSaldo();
        });

        this.f.taquilla.valueChanges.subscribe(value => {
            this.obtenerSaldo();
        });

        this.f.atm.valueChanges.subscribe(value => {
            this.obtenerSaldo();
        });

        this.f.moneda.valueChanges.subscribe(value => {
            this.obtenerSaldo();
        });

        this.f.monto.valueChanges.subscribe(value => {
            this.validarBalance(value);
        });
    }

    obtenerSaldo() {

        this.saldoDisponible = 0;
        this.f.monto.setValue(undefined);

        if (this.f.movimientoEfectivo.value != undefined &&
            this.f.moneda.value != undefined &&
            (this.f.taquilla.value != undefined || this.f.atm.value != undefined)) {

            if (this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.BOVEDA_TAQUILLA ||
                this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.BOVEDA_ATM) {

                    console.log('aquiiiiiiiiiiiiiiiiiiiiiiiiii   ');
                    
                this.saldoAgenciaService.getSaldoByMoneda(this.f.moneda.value).subscribe(data => {
                    this.saldoDisponible = data;
                    this.validarBalance(this.f.monto.value);
                });

            } else if (this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.TAQUILLA_BOVEDA) {

                this.saldoTaquillaService.getSaldoByMonedaAndTaquilla(this.f.moneda.value, this.f.taquilla.value).subscribe(data => {
                    this.saldoDisponible = data;
                    this.validarBalance(this.f.monto.value);
                });

            } else if (this.f.movimientoEfectivo.value === MovimientoEfectivoConstants.ATM_BOVEDA) {
                console.log('Voy por el saldo en atm   ');
                this.validarBalance(this.f.monto.value);
            }
        }
    }

    validarBalance(monto: number) {

        if (this.saldoDisponible < monto) {
            this.itemForm.controls['monto'].setErrors({
                balance: true
            });
            this.cdr.detectChanges();
        } 
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.bovedaAgencia);
        this.saveOrUpdate(this.bovedaAgenciaService, this.bovedaAgencia, 'El Pase de Efectivo', this.isNew);
    }

}
