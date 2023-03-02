import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Agencia } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Retiro, RetiroService } from 'src/@sirio/domain/services/taquilla/retiro.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';



@Component({
    selector: 'app-pago-cheque-form',
    templateUrl: './pago-cheque-form.component.html',
    styleUrls: ['./pago-cheque-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PagoChequeFormComponent extends FormBaseComponent implements OnInit {
    public voucherForm: FormGroup;
    public itemForm: FormGroup;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]); //lista  
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    retiro: Retiro = {} as Retiro;
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    loading = new BehaviorSubject<boolean>(false);
    saldoCuenta: number = 0;
    existeDiferenciaSaldo: boolean = false;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,
        private personaService: PersonaService,
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
                    } else {
                        this.f.numeroCuenta.setErrors({ validacion: true });
                    }
                });

                this.f.monto.valueChanges.subscribe(val => {
                    if (val) {
                        this. diferenciaSaldo();
                        if (!this.existeDiferenciaSaldo) {
                            this.calculateDifferences();
                        }
                        this.cdr.detectChanges();
                    } else if (val === null || val === '') {
                        this.f.monto.setValue(0.00);
                        this.cdr.detectChanges();
                    }
                });

                // manejo de escritura en el campo NUMERO DE CUENTA
                this.f.numeroCuenta.valueChanges.pipe(
                    distinctUntilChanged(),
                    debounceTime(1000)
                ).subscribe(() => {
                    // se busca los dato que el usuario suministro    
                    const numeroCuenta = this.f.numeroCuenta.value;
                    if (numeroCuenta) {
                        this.cuentaBancariaService.activesByNumeroCuenta(numeroCuenta).subscribe(data => {
                            let cuenta = this.cuentaBancariaOperacion = data;
                            this.retiroService.getSaldoByCuenta(cuenta.id).subscribe(data => {
                                this.saldoCuenta = data;
                                this.diferenciaSaldo();





                                this.f.moneda.setValue({
                                    id: cuenta.moneda,
                                    nombre: cuenta.monedaNombre,
                                    siglas: cuenta.siglas
                                });
                                
                                // Se llama a la funcion para verificar si hay saldo en taquilla para la moneda  
                                this.saldoByMoneda(this.f.moneda.value);
                                this.loading.next(true);
                                // this.persona.nombre = this.cuentaBancariaOperacion.nombre;
                                // Guarda la Data cuando es solo Abono en Efectivo
                                this.persona.identificacion = cuenta.identificacion;
                                this.persona.nombre = cuenta.nombre;
                                this.persona.email = cuenta.email;
                                this.persona.tipoDocumento = cuenta.tipoDocumento;
                                this.persona.id = cuenta.id;
                                // this.f.tipoDocumentoBeneficiario.setValue(PersonaConstants.PN_TIPO_DOC_DEFAULT);





                            });

                        }, err => {
                            this.f.numeroCuenta.setErrors({ notexists: true });
                            this.limpiar();
                            // this.resetInfobeneficiary();
                            this.loading.next(false)
                            this.cdr.detectChanges();

                        })
                    }
                });

                // this.f.identificacionBeneficiario.valueChanges.subscribe(val => {
                //     if (val) {
                //         if (this.f.identificacionBeneficiario.value === this.cuentaBancariaOperacion.identificacion) {
                //             this.f.email.setValue(this.cuentaBancariaOperacion.email);
                //             this.f.beneficiario.setValue(this.cuentaBancariaOperacion.nombre);
                //             this.cdr.detectChanges();
                //         } else {
                //             this.f.email.setValue('');
                //             this.f.beneficiario.setValue('');
                //             this.cdr.detectChanges();
                //         }
                //     }
                // });
                this.cdr.detectChanges();
            }
        });
    }

    buildForm() {

        this.itemForm = this.fb.group({
            numper: new FormControl(undefined),
            // beneficiario: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE), Validators.required]),
            // tipoDocumentoBeneficiario: new FormControl(undefined, [Validators.required]),
            // identificacionBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl('', [Validators.required]),
            moneda: new FormControl(undefined),
            tipoProducto: new FormControl(''),
            serialCheque: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl('', [Validators.required]),
            // email: new FormControl(undefined),
            conoActual: new FormControl([]),
            conoAnterior: new FormControl([]),
        });
    }

    diferenciaSaldo() {
        if (this.f.monto && this.saldoCuenta < this.f.monto.value) {
            this.f.monto.setErrors({
                saldo: true
            });
            this.f.montoCheque.setValue(0.00);
            this.existeDiferenciaSaldo = true;
            this.f.monto.markAsDirty();
        } else {
            this.f.monto.setErrors(undefined);
            this.existeDiferenciaSaldo = false;
        }
        this.cdr.detectChanges();
    }

    voucher(voucherForm: FormGroup) {
        this.voucherForm = voucherForm;
    }

    calculateDifferences(event?: any) {

        let valorEfectivo = this.f.monto.value ? this.f.monto.value : 0.00;
        let montoCheque = this.f.montoCheque.value ? this.f.montoCheque.value : 0.00;
        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        let valor = (Math.abs(valorEfectivo - (event ? (event.montoTotal > 0 ? event.montoTotal : montoCheque) : montoCheque)) >= 1);
        if (valor || (event?.montoTotal === 0)) {

            this.f.monto.setErrors({
                difference: true
            });

            if (event && (event.montoTotal > 0)) {
                this.f.montoCheque.setValue(event.montoTotal);
                this.f.montoCheque.setErrors({
                    totalDifference: true
                });

                this.f.montoCheque.markAsDirty();
                this.cdr.detectChanges();
            }

            this.f.montoCheque.markAsDirty();
            this.f.monto.markAsDirty();
            this.cdr.detectChanges()

        } else {
            if (event) {
                this.f.montoCheque.setValue(this.f.monto.value);
                this.f.montoCheque.setErrors(undefined);
                this.f.monto.setErrors(undefined);
            } else {
                this.f.monto.setErrors({
                    difference: true
                });
                this.f.monto.markAsDirty();
            }
        }
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }
        this.f.montoCheque.setValue(event.montoTotal);
        this.calculateDifferences(event)
        this.f.conoActual.setValue(event.desgloseConoActual);
        this.f.conoAnterior.setValue(event.desgloseConoAnterior);
        this.cdr.detectChanges();
    }

    saldoByMoneda(moneda: Moneda) {
        this.saldoTaquillaService.getSaldoByMoneda(moneda.id).subscribe(saldo => {
            if (saldo == 0) {
                let mensaje = 'Para La Moneda <b>' + moneda.nombre + '</b> <br> No existe Disponibilidad En Su Caja'
                this.swalService.show('No Hay Disponibilidad De Efectivo', undefined, { html: mensaje, showCancelButton: false }).then((resp) => {
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
        this.swalService.show('¿Desea Realizar el Pago de Cheque?', undefined,
            { 'html': 'Titular: <b>' + this.persona.nombre + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' + this.f.moneda.value.siglas + '</b>' }
        ).then((resp) => {
            if (!resp.dismiss) {
                this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
                this.retiro.cuentaBancaria = this.cuentaBancariaOperacion.id;
                this.retiro.tipoDocumento = this.cuentaBancariaOperacion.tipoDocumento;
                this.retiro.tipoDocumentoCheque = GlobalConstants.CHEQUE;
                // this.retiro.email = (this.retiro.email != undefined && this.retiro.email != '') ? this.retiro.email : this.f.email.value;
                this.retiro.detalles = this.f.conoActual.value.concat(this.f.conoAnterior.value);
                this.retiro.moneda = this.f.moneda.value.id;
                this.retiro.operacion = 'cheque';
                this.updateDataFromValues(this.retiro, this.voucherForm.value)
                this.saveOrUpdate(this.retiroService, this.retiro, 'El Pago del Cheque', false);
                this.loadingDataForm.subscribe(status => {
                    if (!status) {
                        this.router.navigate(['/sirio/welcome']).then(data => { });
                    }
                })
            }

        })

    }

    resetInfoFinance() {
        this.f.numeroCuenta.reset();
        this.limpiar();
    }

    limpiar() {
        this.f.serialCheque.reset();
        this.f.monto.reset();
        this.f.monto.setValue(0.00);
        this.f.montoCheque.reset();
        this.f.montoCheque.setValue(0.00);
    }

    // resetInfobeneficiary() {
    //     this.tipoDocumentos.next([]);
    //     this.f.beneficiario.reset();
    //     this.f.tipoDocumentoBeneficiario.reset();
    //     this.f.identificacionBeneficiario.reset();
    //     this.f.email.reset();
    // }

}
