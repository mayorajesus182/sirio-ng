import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { SolicitudRemesa, SolicitudRemesaService } from 'src/@sirio/domain/services/control-efectivo/solicitud-remesa.service copy';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-solicitud-remesa-form',
    templateUrl: './solicitud-remesa-form.component.html',
    styleUrls: ['./solicitud-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitudRemesaFormComponent extends FormBaseComponent implements OnInit {

    solicitudRemesa: SolicitudRemesa = {} as SolicitudRemesa;
    public detalles = new BehaviorSubject<CupoAgencia[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    
    movimientoEfectivo: MovimientoEfectivo = {} as MovimientoEfectivo;
    taquilla: Taquilla = {} as Taquilla;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public conoSave: ConoMonetario[] = [];
    saldoDisponible: number = 0;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private solicitudRemesaService: SolicitudRemesaService,
        private transportistaService: TransportistaService,
        private cupoAgenciaService: CupoAgenciaService,
        private saldoTaquillaService: SaldoTaquillaService,
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
            this.solicitudRemesaService.get(id).subscribe((agn: SolicitudRemesa) => {
                this.solicitudRemesa = agn;
                this.buildForm(this.solicitudRemesa);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.solicitudRemesa);
            this.loadingDataForm.next(false);
        }

        this.cupoAgenciaService.activesParaRemesa().subscribe(data => {
            this.detalles.next(data);
            this.cdr.detectChanges();           
        });

        this.transportistaService.allCentrosAcopio().subscribe(data => {
            this.transportistas.next(data);
            this.cdr.detectChanges();           
        });
    }

    buildForm(solicitudRemesa: SolicitudRemesa) {
        this.itemForm = this.fb.group({
            transportista: new FormControl(''),
            fecha: new FormControl(''),
            // moneda: new FormControl(solicitudRemesa.moneda || undefined, Validators.required),
            // monto: new FormControl(solicitudRemesa.monto || undefined, Validators.required),
        });

        // this.f.moneda.valueChanges.subscribe(val => {
        //     this.obtenerSaldo();
        //     this.conoMonetarioService.activesWithDisponibleSaldoTaquillaByMoneda(val).subscribe(data => {
        //         this.conos.next(data);
        //         this.cdr.detectChanges();
        //     });
        // });

        // this.f.monto.valueChanges.subscribe(val => {
        //     if (val) {
        //         this.validarBalance(val);
        //     }

        // });
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

        this.updateData(this.solicitudRemesa);
        // this.solicitudRemesa.taquilla = this.taquilla.id;
        // this.solicitudRemesa.movimientoEfectivo = this.movimientoEfectivo.id;
        // this.solicitudRemesa.detalleEfectivo = this.conoSave;

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        if (!existsDifference) {
            this.saveOrUpdate(this.solicitudRemesaService, this.solicitudRemesa, 'El Pase a Bóveda', this.isNew);
        } else {

            this.swalService.show('Sobrepasó una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });

        }
    }

}

