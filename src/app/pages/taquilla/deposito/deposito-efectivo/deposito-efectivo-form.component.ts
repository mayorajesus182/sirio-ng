import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { TipoDocumento } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'sirio-deposito-efectivo',
    templateUrl: './deposito-efectivo-form.component.html',
    styleUrls: ['./deposito-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoEfectivoFormComponent extends FormBaseComponent implements OnInit {

    @Input() cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    @Input() persona: Persona = {} as Persona;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    // public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private cuentaBancariaService: CuentaBancariaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.itemForm = this.fb.group({
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl(undefined),
            numeroCuenta: new FormControl(undefined),
            moneda: new FormControl(undefined),
            efectivo: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            conoActual: new FormControl([]),
            conoAnterior: new FormControl([]),
            operacion: new FormControl(''),

        });

        this.cargaDatos();

        this.f.efectivo.valueChanges.subscribe(val => {
            if (val) {
                this.calculateDifferences();
            } else if (val === null || val == undefined) {
                this.f.efectivo.setValue(0.00);
                this.cdr.detectChanges();
            }
        });

        //Me trae la data de la cuenta que se selecciono
        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
                this.f.moneda.setValue({
                    id: cuenta.moneda,
                    nombre: cuenta.monedaNombre,
                    siglas: cuenta.siglas
                });
                this.f.tipoProducto.setValue(cuenta.tipoProducto);
            }
        });
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
        this.itemForm.valueChanges.subscribe(val => {
            if (val) {
                this.result.emit(this.itemForm)
            }
        })
    }

    cargaDatos() {
        if (this.persona) {
            if (!this.persona.id && !this.persona.numper) {
                this.loaded$.next(false);
                this.persona = {} as Persona;
                this.cuentaOperacion = undefined;
                this.cdr.detectChanges();
            } else {
                if (this.cuentaOperacion && this.cuentaOperacion.moneda) {
                    this.f.moneda.setValue({
                        id: this.cuentaOperacion.moneda,
                        nombre: this.cuentaOperacion.monedaNombre,
                        siglas: this.cuentaOperacion.siglas
                    });
                    this.f.numeroCuenta.setValue(this.cuentaOperacion.numeroCuenta);
                    this.f.tipoDocumento.setValue(this.cuentaOperacion.tipoDocumento);
                    this.f.identificacion.setValue(this.cuentaOperacion.identificacion);
                    this.f.cuentaBancaria.setValue(this.cuentaOperacion.id);
                } else {
                    this.cuentaOperacion = undefined;
                    this.f.identificacion.setValue(this.persona.identificacion);
                    this.f.tipoDocumento.setValue(this.persona.tipoDocumento);
                    this.cuentaBancariaService.activesByNumper(this.persona.numper).subscribe(data => {
                        this.cuentasBancarias.next(data);
                        if (data.length === 1) {
                            this.f.cuentaBancaria.setValue(data[0].id);
                        }
                    });
                }
            }
        }
    }


    calculateDifferences(event?: any) {

        let valorEfectivo = this.f.efectivo.value ? this.f.efectivo.value : 0.00;
        let montoDeposito = this.f.monto.value ? this.f.monto.value : 0.00;
        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        if ((Math.abs(valorEfectivo - (event ? (event.montoTotal > 0 ? event.montoTotal : montoDeposito) : montoDeposito)) >= 1) || (event?.montoTotal===0)) {

            this.f.efectivo.setErrors({
                difference: true
            });
            // && (event.montoTotal > 0)
            if (event && event.montoTotal > 0) {
                this.f.monto.setValue(event.montoTotal);
                this.f.monto.setErrors({
                    totalDifference: true
                });
                this.f.monto.markAsDirty();
                this.cdr.detectChanges();
            }
            this.f.monto.markAsDirty();
            this.f.efectivo.markAsDirty();
        } else {
            if (event) {

                this.f.monto.setValue(this.f.efectivo.value);
                // this.f.totalRetiro.setValue(event.montoTotal);
                this.f.monto.setErrors(undefined);
                this.f.efectivo.setErrors(undefined);
            }else{
                this.f.efectivo.setErrors({
                    difference: true
                });
                this.f.efectivo.markAsDirty();
            }
        }
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }
        this.f.monto.setValue(event.montoTotal);
        this.calculateDifferences(event)
        this.f.conoActual.setValue(event.desgloseConoActual);
        this.f.conoAnterior.setValue(event.desgloseConoAnterior);
        this.cdr.detectChanges();
    }

    reset() {
        this.itemForm.reset({});
        this.cargaDatos();
        this.f.efectivo.setValue(0.00);
        this.f.monto.setValue(0.00);
    }
}



