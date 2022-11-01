import { formatNumber } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { difference } from 'lodash-es';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { MotivoDevolucion, MotivoDevolucionService } from 'src/@sirio/domain/services/configuracion/taquilla/motivo-devolucion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Cheque, Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'app-deposito-form',
    templateUrl: './deposito-form.component.html',
    styleUrls: ['./deposito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {

    public chequeForm: FormGroup;
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    public motivosDevoluciones: MotivoDevolucion[] = [];
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public tiposDocumentoNaturales = new BehaviorSubject<TipoDocumento[]>([]);
    cheques: ReplaySubject<Cheque[]> = new ReplaySubject<Cheque[]>();
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    chequeList: Cheque[] = [];
    cheque: Cheque = {} as Cheque;
    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    todayValue: moment.Moment;
    numCuenta: string = "";
    tipoProducto: string = "";
    detalleEfectivo: number = 0;
    editing: any[] = [];
    sumMontoChequePropio: number = 0;
    sumMontoChequeOtros: number = 0;

    loading = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private depositoService: DepositoService,
        private tipoDocumentoService: TipoDocumentoService,
        private cuentaBancariaService: CuentaBancariaService,
        private personaService: PersonaService,
        private calendarioService: CalendarioService,
        private taquillaService: TaquillaService,
        private sessionService: SessionService,
        private motivoDevolucionService: MotivoDevolucionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.taquillaService.isOpen().subscribe(isOpen => {
            if (isOpen) {
                this.router.navigate(['/sirio/welcome']);
                this.swalService.show('message.closedBoxOfficeTitle', 'message.closedBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) { }
                });

            } else {

                this.isNew = true;
                // this.loadingDataForm.next(true);
                this.buildForm();
                // this.loadingDataForm.next(false);
                // this.applyFieldsDirty();
                // this.tipoDocumentoService.actives().subscribe(data => {
                //     this.tiposDocumentos.next(data);
                // });

                this.tipoDocumentoService.activesNaturales().subscribe(data => {
                    this.tiposDocumentoNaturales.next(data);
                });

                // if (this.f.tipoDocumento.value == "") {
                //     this.f.identificacion.disable();
                //     this.f.esEfectivo.enable();
                //     this.f.esCheque.disable();
                // }

                // this.f.tipoDocumento.valueChanges.subscribe(val => {
                //     if (val) {
                //         this.f.identificacion.enable()
                //     }

                //     this.f.identificacion.reset();
                //     this.persona = {} as Persona;
                //     this.cuentaOperacion = {} as CuentaBancariaOperacion;
                //     this.cuentasBancarias.next([]);
                //     this.f.cuentaBancaria.setValue(undefined);
                //     this.f.esEfectivo.enable();
                //     this.f.esCheque.disable();
                //     this.f.esEfectivo.setValue(true);
                //     this.f.esCheque.setValue(false);
                // })


                this.f.efectivo.valueChanges.subscribe(val => {
                    if (val) {
                        this.calculateDifferences();
                    }
                })

                this.f.monto.valueChanges.subscribe(val => {
                    if (val) {
                        this.calculateDifferences();
                    }
                })

                this.f.chequePropio.valueChanges.subscribe(val => {
                    if (val) {
                        this.errorDiferenciaChequesPropios(this.sumMontoChequePropio);
                        this.calculateDifferences();
                    }
                })

                this.f.chequeOtros.valueChanges.subscribe(val => {
                    if (val) {
                        this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros);
                        this.calculateDifferences();
                    }
                })

                //TODO: Revisar
                // this.f.cuentaBancaria.valueChanges.subscribe(val => {
                //     if (val) {
                //         //obtiendo el unico resultado seleccionado al aplicar el filtro
                //         this.cuentaOperacion = this.cuentasBancarias.value.filter(e => e.id == val)[0] as CuentaBancariaOperacion;
                //         this.f.esEfectivo.enable()
                //         this.f.esCheque.enable()
                //         this.moneda.id = this.cuentaOperacion.moneda;
                //         this.moneda.nombre = this.cuentaOperacion.monedaNombre;
                //         this.f.monto.setValue('');
                //         this.f.efectivo.setValue(undefined);
                //         this.f.referencia.setValue('');
                //         this.f.email.setValue('');
                //         this.f.telefono.setValue(undefined);
                //     }
                // })

                this.f.esCheque.valueChanges.subscribe(val => {
                    if (val) {
                        this.buildChequeForm();
                    }
                    else {
                        this.f.monto.setValue('');
                        this.f.referencia.setValue('');
                        this.f.chequePropio.setValue(undefined);
                        this.f.chequePropio.setErrors(undefined);
                        this.f.chequeOtros.setValue(undefined);
                        this.f.chequeOtros.setErrors(undefined);
                    }
                })

                // manejo de escritura en el campo identificacion
                // this.f.identificacion.valueChanges.pipe(
                //     distinctUntilChanged(),
                //     debounceTime(500)
                // ).subscribe(() => {
                // se busca los dato que el usuario suministro      
                // const tipoDocumento = this.f.tipoDocumento.value;
                // const identificacion = this.f.identificacion.value;
                // if (tipoDocumento && identificacion) {
                //     this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                //         this.persona = data;
                //         const numper = data.numper;

                //         this.cuentaBancariaService.activesByNumper(numper).subscribe(cuenta => {
                //             this.cuentasBancarias.next(cuenta);
                //         });

                //         this.cdr.markForCheck();
                //     }, err => {
                //         this.f.identificacion.setErrors({ notexists: true });
                //         this.persona = {} as Persona;
                //         this.cuentasBancarias.next([]);
                //         this.cuentaOperacion = {} as CuentaBancariaOperacion;
                //         this.f.cuentaBancaria.setValue(undefined);
                //         this.f.esEfectivo.enable();
                // this.f.esEfectivo.setValue(true);
                // this.f.esCheque.disable();
                // this.f.esCheque.setValue(false);
                // this.cdr.detectChanges();

                // prueba------------------------------------------------------------------------
                // this.f.monto.setValue('');
                // this.f.efectivo.setValue(undefined);
                // this.f.referencia.setValue('');
                // this.f.email.setValue('');
                // this.f.telefono.setValue('');
                // Chequeeeees
                // this.f.chequeOtros.setValue(undefined);
                // this.f.chequePropio.setValue(undefined);
                // this.f.numeroCuentaCheque.setValue('');
                // this.cf.serial.setValue(undefined);
                // this.cf.fechaEmision.setValue(undefined);
                // this.cf.tipoDocumentoCheque.setValue(undefined);
                // this.cf.codigoSeguridad.setValue(undefined);
                // this.cf.montoCheque.setValue(undefined);
                // fin-----------------------------------------------------------------------------
                //         })
                //     }
                // });

                this.loading$.subscribe(val => {
                    if (val) {
                        this.persona = {} as Persona;
                        this.cuentaOperacion = {} as CuentaBancariaOperacion;
                        this.cuentasBancarias.next([]);
                        this.f.esEfectivo.enable();
                        this.f.esCheque.disable();
                    }
                });

                this.calendarioService.today().subscribe(data => {
                    this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
                    this.cdr.detectChanges();
                });


            }
        });


        this.motivoDevolucionService.actives().subscribe(data => {
            this.motivosDevoluciones = data;
        });

        this.cheques.subscribe(data => {
            if (!data || data.length == 0) {
                this.chequeList = [];
            }
            this.cdr.detectChanges();
        })
    }

    calculateDifferences() {

        let valorEfectivo = this.f.efectivo.value ? this.f.efectivo.value : 0;
        // let valorChequePropio = this.f.chequePropio.value ? this.f.chequePropio.value : 0;
        // let valorChequeOtros = this.f.chequeOtros.value ? this.f.chequeOtros.value : 0;

        if (valorEfectivo != this.f.monto.value) {
            console.log("pruebaaaaaaaa", this.f.monto.value);
            
            this.itemForm.controls['monto'].setErrors({
                totalDifference: true,
            });
            this.itemForm.controls['efectivo'].setErrors({
                difference: true,
            });
            // this.f.monto.setErrors({ totalDifference: true });
            // this.f.efectivo.setErrors({ difference: true });
            this.cdr.detectChanges();
        } else {
            this.f.monto.setErrors( undefined);
            this.f.efectivo.setErrors(undefined);
            this.cdr.detectChanges();
        }

        




    }

    buildForm() {
        this.itemForm = this.fb.group({

            nombre: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl(undefined, []),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numeroCuenta: new FormControl(undefined),
            moneda: new FormControl('', []),
            efectivo: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            monto: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            referencia: new FormControl('', Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)),
            esEfectivo: new FormControl(true),
            esCheque: new FormControl(false),
            // btnEfectivo: new FormControl(true),
            tipoDocumentoDepositante: new FormControl('', Validators.required),
            identificacionDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            nombreDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            telefono: new FormControl(''),
            email: new FormControl(''),
            // cantidadPropio: new FormControl(deposito. undefined, [Validators.required]),
            // cantidadOtros: new FormControl(deposito undefined, [Validators.required]),
            conLibreta: new FormControl(false),
            conMovimiento: new FormControl(false),
            libreta: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            linea: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            chequeOtros: new FormControl(undefined),
            chequePropio: new FormControl(undefined),

        });

        this.f.esEfectivo.valueChanges.subscribe(val => {
            if (!val) {
                this.f.efectivo.setValue(undefined);
                this.f.efectivo.setErrors(undefined);
                this.conoActual = [];
                this.conoAnterior = [];
                this.f.monto.setValue(undefined);
                this.f.referencia.setValue('');
                // this.applyFieldsDirty();
            }
            // this.applyFieldsDirty();
        })

        this.f.conLibreta.valueChanges.subscribe(val => {
            if (!val) {
                this.f.libreta.setValue(undefined);
                this.f.libreta.setErrors(undefined);
                this.f.linea.setValue(undefined);
                this.f.linea.setErrors(undefined);
                this.cdr.detectChanges();
            }

        })

        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                this.moneda.id = cuenta.moneda;
                this.moneda.nombre = cuenta.monedaNombre;
                this.moneda.siglas = cuenta.siglas;
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
                this.f.moneda.setValue(this.moneda.id);
                this.f.tipoProducto.setValue(cuenta.tipoProducto);
                // Revisaaaaaaaaaaaaaaaaaaaaaaar JJSD
                this.f.esEfectivo.enable()
                this.f.esCheque.enable()
                this.f.esEfectivo.setValue(true);
                this.cdr.detectChanges();
            }
        })
    }

    buildChequeForm() {

        this.chequeForm = this.fb.group({
            numeroCuentaCheque: new FormControl(undefined, Validators.required),
            montoCheque: new FormControl(undefined),
            serial: new FormControl(undefined, Validators.pattern(RegularExpConstants.NUMERIC)),
            fechaEmision: new FormControl(undefined),
            motivoDevolucion: new FormControl(undefined),
            tipoDocumentoCheque: new FormControl(undefined, Validators.pattern(RegularExpConstants.NUMERIC)),
            codigoSeguridad: new FormControl(undefined, Validators.pattern(RegularExpConstants.NUMERIC)),
        })


        this.cf.serial.valueChanges.subscribe(val => {
            if (val) {
                if (!this.validateSerialAccountUnique(val, this.cf.numeroCuentaCheque.value)) {
                    this.cf.serial.setErrors({ uniqueSerial: true })
                } else {
                    this.cf.serial.setErrors(null)
                    this.cf.numeroCuentaCheque.setErrors(null)
                }
            }
        });


        this.cf.numeroCuentaCheque.valueChanges.subscribe(val => {
            if (val) {
                if (!this.validateSerialAccountUnique(this.cf.serial.value, val)) {
                    this.cf.numeroCuentaCheque.setErrors({ uniqueNumAccount: true })
                } else {
                    this.cf.serial.setErrors(null)
                    this.cf.numeroCuentaCheque.setErrors(null)
                }
            }
        });

        this.cf.tipoDocumentoCheque.valueChanges.subscribe(val => {
            if (val) {
                if ((val === GlobalConstants.CHEQUE) || (val === GlobalConstants.CHEQUE_GERENCIA)) {
                    this.cf.tipoDocumentoCheque.setErrors(undefined)
                    this.cdr.detectChanges();
                } else {
                    this.cf.tipoDocumentoCheque.setErrors({ tipDocCheque: true })
                    this.cdr.detectChanges();
                }
            }
        })
    }

    get cf() {
        return this.chequeForm ? this.chequeForm.controls : {};
    }

    add() {
        if (this.chequeForm.invalid)
            return;

        let cheque = {} as Cheque;
        this.updateDataFromValues(cheque, this.chequeForm.value);
        this.chequeList.push(cheque);
        this.cheques.next(this.chequeList.slice());
        this.chequeForm.reset({});
        if (this.sessionService.getUser().organizationId === cheque.numeroCuentaCheque.substring(0, 4)) {
            this.sumMontoChequePropio += cheque.montoCheque;
            this.errorDiferenciaChequesPropios(this.sumMontoChequePropio);
            this.cdr.detectChanges();
        } else {
            this.sumMontoChequeOtros += cheque.montoCheque;
            this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros);
            this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
    }

    delete(row) {
        this.swalService.show('¿Desea Eliminar El Cheque?', '').then((resp) => {
            if (!resp.dismiss) {

                this.chequeList.forEach((e, index) => {
                    if (e.serial + e.numeroCuentaCheque === row.serial + row.numeroCuentaCheque) {
                        this.chequeList.splice(index, 1);
                        this.cheques.next(this.chequeList.slice());


                        if (this.sessionService.getUser().organizationId === row.numeroCuentaCheque.substring(0, 4)) {
                            this.sumMontoChequePropio -= row.montoCheque;
                            this.errorDiferenciaChequesPropios(this.sumMontoChequePropio);
                        } else {
                            this.sumMontoChequeOtros -= row.montoCheque;
                            this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros);
                        }
                    }
                    this.cdr.detectChanges();
                });
            }
        });
    }


    errorDiferenciaChequesOtros(val: number) {
        if (val != this.f.chequeOtros.value) {
            this.itemForm.controls['chequeOtros'].setErrors({
                differenceOtros: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.chequeOtros.setErrors(undefined);
        }
    }

    errorDiferenciaChequesPropios(val: number) {
        if (val != this.f.chequePropio.value) {
            this.itemForm.controls['chequePropio'].setErrors({
                differencePropio: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.chequePropio.setErrors(undefined);
        }
    }

    queryResult(data: any) {
        this.itemForm.reset({});
        if (data) {
            if (!data.id && !data.numper) {
                this.loaded$.next(false);
                this.persona = {} as Persona;
                this.cuentaOperacion = undefined;
                // this.itemForm.reset({});
                this.loading.next(false);
                this.cdr.detectChanges();
            } else {
                if (data.moneda) {
                    this.cuentaOperacion = data;
                    console.log("Pruebaaaaaaaaaaa 2222222", this.cuentaOperacion);
                    this.moneda.id = this.cuentaOperacion.moneda;
                    this.moneda.nombre = this.cuentaOperacion.monedaNombre;
                    this.moneda.siglas = this.cuentaOperacion.monedaSiglas;
                    this.f.numeroCuenta.setValue(this.cuentaOperacion.numeroCuenta);
                    this.f.tipoDocumento.setValue(this.cuentaOperacion.tipoDocumento);
                    this.f.identificacion.setValue(this.cuentaOperacion.identificacion);
                    this.f.esEfectivo.setValue(true);
                    this.loading.next(true);
                } else {

                    this.persona = data;
                    console.log("Pruebaaaaaaaaaaa", this.persona);
                    
                    this.cuentaOperacion = undefined;
                    this.moneda.siglas = undefined;
                    this.f.identificacion.setValue(this.persona.identificacion);
                    this.f.tipoDocumento.setValue(this.persona.tipoDocumento);
                    this.f.esEfectivo.setValue(true);
                    this.loading.next(true);
                    this.cuentaBancariaService.activesByNumper(this.persona.numper).subscribe(data => {
                        this.cuentasBancarias.next(data);
                        if(data.length === 1){                    
                            this.f.cuentaBancaria.setValue(data[0].id);
                        }
                    });

                }
            }
        }

    }

    cleanScreen() {
        this.queryResult(this.cuentaOperacion.tipoDocumento)
        this.conoActual = [];
        this.conoAnterior = [];
        this.moneda = {} as Moneda;
        this.detalleEfectivo = 0;
        this.sumMontoChequePropio = 0;
        this.sumMontoChequeOtros = 0;
        this.cheque = {} as Cheque;
        this.cheques.next([]);
        this.loading.next(false);
        this.cdr.detectChanges();
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }
        // this.f.efectivo.setValue(event.montoTotal);
        this.f.monto.setValue(event.montoTotal);
        this.conoActual = event.desgloseConoActual;
        this.conoAnterior = event.desgloseConoAnterior;
        this.cdr.detectChanges();
    }

    selectMotivoDevolucion(event, row: Cheque) {
        row.motivoDevolucion = (event.target as HTMLSelectElement).value;
    }

    validateSerialAccountUnique(serial: string, numeroCuentaCheque: string) {
        if (!serial || !numeroCuentaCheque) {
            return true;
        }
        return this.chequeList.find(c => c.serial === serial && c.numeroCuentaCheque === numeroCuentaCheque) == undefined;
    }

    resetInfoFinance() {
        this.f.cuentaBancaria.setValue(undefined);
        // this.moneda.nombre = undefined;
        this.moneda.siglas = undefined;
        this.f.efectivo.setValue(undefined);
        this.f.esEfectivo.disable()
        this.f.monto.reset({});
        this.f.esEfectivo.setValue(false);
        this.f.esCheque.setValue('');
        this.f.conLibreta.setValue('');
        this.f.conMovimiento.setValue('');
    }

    resetInfDeposit() {
        this.f.tipoDocumentoDepositante.reset({});
        this.f.identificacionDepositante.setValue('');
        this.f.nombreDepositante.setValue('');
        this.f.email.setValue('');
    }

    libretaEvaluate(event) {
        if (event.checked) {
            this.f.conMovimiento.setValue(false);
        }
    }

    movimientoEvaluate(event) {
        if (event.checked) {
            this.f.conLibreta.setValue(false);
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);

        let montoFormat = formatNumber(this.deposito.monto, 'es', '1.2');

        this.swalService.show('¿Desea Realizar el Deposito?', undefined, 
        {'html': 'Titular: <b>' + this.persona.nombre + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' + this.moneda.siglas+'</b>'} 
        ).then((resp) => {
            if (!resp.dismiss) {
                this.updateDataFromValues(this.deposito, this.persona);
                this.deposito.persona = this.persona.id;
                this.deposito.nombre = this.persona.nombre;
                this.deposito.numper = this.persona.numper;
                this.deposito.tipoDocumento = this.persona.tipoDocumento;
                this.deposito.identificacion = this.persona.identificacion;
                this.updateDataFromValues(this.deposito, this.cuentaOperacion);
                this.deposito.detalles = this.conoActual.concat(this.conoAnterior);
                this.deposito.cheques = this.chequeList;
                this.saveOrUpdate(this.depositoService, this.deposito, 'El Deposito');
                //this.cleanScreen();
                this.router.navigate(['/sirio/welcome']).then(data => { });
            }
        })


    }
}



