// import { TipoTelefonoService } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefono.service';
import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Retiro, RetiroService } from 'src/@sirio/domain/services/taquilla/retiro.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';



@Component({
    selector: 'app-pago-cheque-gerencia-form',
    templateUrl: './pago-cheque-gerencia-form.component.html',
    styleUrls: ['./pago-cheque-gerencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PagoChequeGerenciaFormComponent extends FormBaseComponent implements OnInit {
    public voucherForm: FormGroup;
    public itemForm: FormGroup;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]); //lista  
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);//lista
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];

    retiro: Retiro = {} as Retiro;
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    cuentaOperacion: CuentaBancaria = {} as CuentaBancaria;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    conAbonoCta: boolean = false;
    loading = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,
        private taquillaService: TaquillaService,
        private saldoTaquillaService: SaldoTaquillaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.taquillaService.isOpen().subscribe(isOpen => {
            if (!isOpen) {
                this.router.navigate(['/sirio/welcome']);
                this.swalService.show('message.closedBoxOfficeTitle', 'message.closedBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) { }
                });
            } else {
                this.isNew = true;
                this.buildForm();
                this.loadingDataForm.next(false);
                this.f.numeroCuenta.valueChanges.subscribe(val => {
                    if (val) {
                        this.tipoDocumentoService.activesByTipoPersona(PersonaConstants.PERSONA_NATURAL).subscribe(data => {
                            this.tipoDocumentos.next(data);
                        });
                    }
                });

                this.f.montoCheque.valueChanges.subscribe(val => {
                    if (!this.conAbonoCta) {
                        if (val) {
                            this.calculateDifferences();
                            this.cdr.detectChanges()
                        } else if (val === null || val === '') {
                            this.f.montoCheque.setValue(0.00);
                            this.cdr.detectChanges();
                        }
                    } else {
                        if (val) {
                            this.diferenciaMonto();
                            this.cdr.detectChanges()
                        } else if (val === null || val === '') {
                            this.f.montoCheque.setValue(0.00);
                            this.cdr.detectChanges();
                        }
                    }
                });

                this.f.monto.valueChanges.subscribe(val => {
                    if (val) {
                        this.diferenciaMonto();
                        this.cdr.detectChanges();
                    } else if (val === null || val === '') {
                        this.f.monto.setValue(0.00);
                        this.cdr.detectChanges();
                    }
                })

                // manejo de escritura en el campo NUMERO DE CUENTA
                this.f.numeroCuenta.valueChanges.pipe(
                    distinctUntilChanged(),
                    debounceTime(1000)
                ).subscribe(() => {
                    // se busca los dato que el usuario suministro    
                    const numeroCuenta = this.f.numeroCuenta.value;
                    if (numeroCuenta) {
                        this.cuentaBancariaService.activesByNumeroCuenta(numeroCuenta).subscribe(data => {
                            let cuenta = this.cuentaOperacion = data;
                            this.f.moneda.setValue({
                                id: cuenta.moneda,
                                nombre: cuenta.monedaNombre,
                                siglas: cuenta.siglas
                            });
                            // Guarda la Data cuando es solo Abono en Efectivo
                            this.persona.identificacion = cuenta.identificacion;
                            this.persona.nombre = cuenta.nombre;
                            this.persona.email = cuenta.email;
                            this.persona.tipoDocumento = cuenta.tipoDocumento;
                            this.persona.id = cuenta.id;

                            //Se llama a la funcion para verificar si hay saldo en taquilla para la moneda  
                            this.saldoByMoneda(this.f.moneda.value);
                            this.loading.next(true);
                            this.cdr.detectChanges();

                        }, err => {
                            this.f.numeroCuenta.setErrors({ notexists: true });
                            this.loading.next(false);
                            this.cdr.detectChanges();

                        })
                    }
                });
                this.cdr.detectChanges();
            }
        });
    }

    voucher(voucherForm: FormGroup) {
        this.voucherForm = voucherForm;
    }

    calculateDifferences(event?: any) {

        let valorMontoCheque = this.f.montoCheque.value ? this.f.montoCheque.value : 0.00;
        let montoRetiro = this.f.monto.value ? this.f.monto.value : 0.00;
        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        let valor = (Math.abs(valorMontoCheque - (event ? (event.montoTotal > 0 ? event.montoTotal : montoRetiro) : montoRetiro)) >= 1);
        if (valor || (event?.montoTotal === 0)) {

            this.f.montoCheque.setErrors({
                difference: true
            });

            if (event && (event.montoTotal > 0)) {
                this.f.monto.setValue(event.montoTotal);
                this.f.monto.setErrors({
                    totalDifference: true
                });

                this.f.monto.markAsDirty();
                this.cdr.detectChanges();
            }
            this.f.monto.markAsDirty();
            this.f.montoCheque.markAsDirty();
            this.cdr.detectChanges()

        } else {
            if (event) {
                this.f.monto.setValue(this.f.montoCheque.value);
                this.f.monto.setErrors(undefined);
                this.f.montoCheque.setErrors(undefined);
            } else {
                this.f.montoCheque.setErrors({
                    difference: true
                });
                this.f.montoCheque.markAsDirty();
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

    buildForm() {

        this.itemForm = this.fb.group({
            identificacion: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            numper: new FormControl(''),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl('', [Validators.required]),
            moneda: new FormControl(''),
            tipoProducto: new FormControl(''),
            serialCheque: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl('', [Validators.required]),
            conAbonoCta: new FormControl(false),
            cuentaBancaria: new FormControl(''),
            conoActual: new FormControl([]),
            conoAnterior: new FormControl([]),

        });

    }

    diferenciaMonto() {
        let valMontoCheque = this.f.montoCheque.value ? this.f.montoCheque.value : 0.00;
        let valMonto = this.f.monto.value ? this.f.monto.value : 0.00;
        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        if (Math.abs(valMontoCheque - valMonto) >= 1) {
            this.f.montoCheque.setErrors({
                invalido: true
            });
            this.f.monto.setErrors({
                total: true
            });
            this.f.monto.markAsDirty();
            this.f.montoCheque.markAsDirty();
            this.cdr.detectChanges();
        } else {
            this.f.montoCheque.setErrors(undefined);
            this.f.monto.setErrors(undefined);
            this.cdr.detectChanges();
        }
    }


    abonoCuentaEvaluate(event) {
        if (event.checked === true) {
            this.f.montoCheque.setErrors(undefined);
            this.f.monto.reset();
            this.f.monto.setValue(0.00);
            this.conAbonoCta = true;
            this.cdr.detectChanges();
        } else {
            this.conAbonoCta = false;
        }
    }

    queryResult(data: any) {
        this.f.cuentaBancaria.setValue(undefined);
        this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;
        this.f.monto.setValue(0.00);
        this.f.monto.markAsDirty();
        this.f.montoCheque.markAsDirty();
        if (!data.id && !data.numper) {
            this.loaded$.next(false);
            this.cdr.detectChanges();
        } else {
            this.loaded$.next(true);
            if (data.moneda) {
                this.cuentaBancariaOperacion = data;
                this.f.moneda.setValue({
                    id: this.cuentaBancariaOperacion.moneda,
                    nombre: this.cuentaBancariaOperacion.monedaNombre,
                    siglas: this.cuentaBancariaOperacion.siglas
                });
                this.persona.identificacion = this.cuentaBancariaOperacion.identificacion;
                this.persona.nombre = this.cuentaBancariaOperacion.nombre;
                this.persona.tipoDocumento = this.cuentaBancariaOperacion.tipoDocumento;
                this.persona.email = this.cuentaBancariaOperacion.email;
                this.persona.id = this.cuentaBancariaOperacion.id;
            }
            else {
                this.loaded$.next(true);
                this.persona = data;
                this.cuentaBancariaOperacion = undefined;
                //lista de las cuentas bancarias de la persona
                this.cuentaBancariaService.activesByPersona(this.persona.id).subscribe(data => {
                    this.cuentasBancarias.next(data);
                    if (data.length === 1) {
                        this.f.cuentaBancaria.setValue(data[0].id);
                    }
                })

            }
        }
    }

    saldoByMoneda(moneda: Moneda) {
        this.saldoTaquillaService.getSaldoByMoneda(moneda.id).subscribe(saldo => {
            if (saldo == 0) {
                let mensaje = 'Para La Moneda <b>' + moneda.nombre + '</b> <br> No Existe Disponibilidad en su Caja'
                this.swalService.show('No hay Disponibilidad de Efectivo', undefined, { html: mensaje, showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) {
                        this.router.navigate(['/sirio/welcome']);
                    }
                });

            }
        })
    }

    save() {

        if (this.itemForm.invalid)
            return;

        this.updateData(this.retiro);
        let montoFormat = formatNumber(this.retiro.monto, 'es', '1.2');
        this.swalService.show('¿Desea Realizar el Pago de Cheque de Gerencia?', undefined,
            { 'html': 'Titular: <b>' + this.persona.nombre + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' + this.f.moneda.value.siglas + '</b>' }
        ).then((resp) => {
            if (!resp.dismiss) {
                this.updateDataFromValues(this.retiro, this.persona);
                this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
                this.retiro.cuentaBancaria = this.persona.id;
                this.retiro.persona = this.persona.id;
                this.retiro.tipoDocumento = this.persona.tipoDocumento;
                this.retiro.identificacion = this.persona.identificacion;
                this.retiro.numper = this.cuentaOperacion.numper;
                this.retiro.tipoProducto = this.cuentaOperacion.tipoProducto;
                this.retiro.tipoDocumentoCheque = GlobalConstants.CHEQUE_GERENCIA;
                this.retiro.conAbonoCta = this.f.conAbonoCta.value;
                this.retiro.detalles = this.f.conoActual ? this.f.conoActual.value.concat(this.f.conoAnterior ? this.f.conoAnterior.value : undefined) : [];
                this.retiro.moneda = this.f.moneda.value.id;
                this.retiro.operacion = 'cheque-gerencia';
                this.updateDataFromValues(this.retiro, this.voucherForm.value);
                this.saveOrUpdate(this.retiroService, this.retiro, 'El Pago del Cheque de Gerencia', false);
                this.loadingDataForm.subscribe(status => {
                    if (!status) {
                        this.router.navigate(['/sirio/welcome']).then(data => { });
                    }
                })
            }

        })

    }

    resetInfoFinance() {
        this.itemForm.reset({});
        this.voucherForm.reset({});
    }
}
