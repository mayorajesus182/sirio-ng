import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { MotivoDevolucion, MotivoDevolucionService } from 'src/@sirio/domain/services/configuracion/taquilla/motivo-devolucion.service';
import { TipoDocumento } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Cheque } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'sirio-deposito-cheques',
    templateUrl: './deposito-cheques-form.component.html',
    styleUrls: ['./deposito-cheques-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoChequesFormComponent extends FormBaseComponent implements OnInit {

    @Input() cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    @Input() persona: Persona = {} as Persona;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    public chequeForm: FormGroup;
    // public conoActual: ConoMonetario[] = [];
    // public conoAnterior: ConoMonetario[] = [];
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public motivosDevoluciones: MotivoDevolucion[] = [];
    chequeList: Cheque[] = [];
    cheques: ReplaySubject<Cheque[]> = new ReplaySubject<Cheque[]>();
    todayValue: moment.Moment;
    sumMontoChequePropio: number = 0;
    sumMontoChequeOtros: number = 0;
    contarChequePropio: number = 0;
    contarChequeOtros: number = 0;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private cuentaBancariaService: CuentaBancariaService,
        private calendarioService: CalendarioService,
        private sessionService: SessionService,
        private motivoDevolucionService: MotivoDevolucionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.itemForm = this.fb.group({
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl(undefined),
            numeroCuenta: new FormControl(undefined),
            chequeOtros: new FormControl(''),
            chequePropio: new FormControl(''),
            moneda: new FormControl(''),
            monto: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            operacion: new FormControl(''),
            cantidadPropio: new FormControl(''),
            cantidadOtros: new FormControl(''),
            detalleCheques: new FormControl(undefined, [Validators.required])
        });


        this.cargaDatos();

        this.f.chequePropio.valueChanges.subscribe(val => {
            if (val) {
                this.errorDiferenciaChequesPropios(this.sumMontoChequePropio);
                this.calculateDifferences();
            }
        });

        this.f.chequeOtros.valueChanges.subscribe(val => {
            if (val) {
                this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros);
                this.calculateDifferences();
            }
        });

        this.f.monto.valueChanges.subscribe(val => {
            if (val) {
                this.errorDiferenciaChequesPropios(this.sumMontoChequePropio);
                this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros);
                this.calculateDifferences();
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

        this.buildChequeForm();

        this.calendarioService.today().subscribe(data => {
            this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
            this.cdr.detectChanges();
        });
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
        this.itemForm.valueChanges.subscribe(val => {
            if (val) {
                this.result.emit(this.itemForm)
            }
        });
    }

    buildChequeForm() {
        this.chequeForm = this.fb.group({
            serial: new FormControl(undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numeroCuentaCheque: new FormControl(undefined, [Validators.required]),
            tipoDocumentoCheque: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl(undefined),
            codigoSeguridad: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            fechaEmision: new FormControl(undefined),
            motivoDevolucion: new FormControl(undefined),
        });

        this.cf.serial.valueChanges.subscribe(val => {
            if (val) {
                if (!this.validateSerialAccountUnique(val, this.cf.numeroCuentaCheque.value)) {
                    this.cf.serial.setErrors({ uniqueSerial: true })
                } else {
                    this.cf.serial.setErrors(null)
                }
            }
        });

        this.cf.numeroCuentaCheque.valueChanges.subscribe(val => {
            if (val) {
                if (!this.validateSerialAccountUnique(this.cf.serial.value, val)) {
                    this.cf.numeroCuentaCheque.setErrors({ uniqueNumAccount: true })
                } else {
                    this.cf.numeroCuentaCheque.setErrors(null)
                }
            }
        });

        this.cf.tipoDocumentoCheque.valueChanges.subscribe(val => {
            if (val) {
                if ((val === GlobalConstants.CHEQUE) || (val === GlobalConstants.CHEQUE_GERENCIA)) {
                    this.cf.tipoDocumentoCheque.setErrors(undefined)
                } else {
                    this.cf.tipoDocumentoCheque.setErrors({
                        tipoDocumentoCheque: true
                    });
                }
            }
        });

        this.motivoDevolucionService.actives().subscribe(data => {
            this.motivosDevoluciones = data;
        });
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
        this.itemForm.controls.detalleCheques.setValue(this.chequeList);
        this.chequeForm.reset({});
        this.refresTotalCheque();
        this.cdr.detectChanges();
    }

    delete(row) {
        this.swalService.show('¿Desea Eliminar El Cheque?', '').then((resp) => {
            if (!resp.dismiss) {
                this.chequeList.forEach((e, index) => {
                    if (e.serial + e.numeroCuentaCheque === row.serial + row.numeroCuentaCheque) {
                        this.chequeList.splice(index, 1);
                        this.cheques.next(this.chequeList.slice());
                        this.itemForm.controls.detalleCheques.setValue(this.chequeList);
                        this.refresTotalCheque();
                    }
                    this.cdr.detectChanges();
                });
            }
        });
    }

    refresTotalCheque() {

        let propios = this.chequeList.filter(c => this.sessionService.getUser().organizationId === c.numeroCuentaCheque.substring(0, 4));
        let otros = this.chequeList.filter(c => this.sessionService.getUser().organizationId != c.numeroCuentaCheque.substring(0, 4));
        this.sumMontoChequePropio = propios.length > 0 ? propios.map(c => c.montoCheque).reduce((a, b) => a + b) : 0;
        this.sumMontoChequeOtros = otros.length > 0 ? otros.map(c => c.montoCheque).reduce((a, b) => a + b) : 0;
        this.contarChequeOtros = otros.length;
        this.contarChequePropio = propios.length;
        this.f.cantidadPropio.setValue(this.contarChequePropio);
        this.f.cantidadOtros.setValue(this.contarChequeOtros);
        this.errorDiferenciaChequesPropios(this.sumMontoChequePropio);
        this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros);
    }

    errorDiferenciaChequesOtros(val: number) {
        if (val != this.f.chequeOtros.value) {
            this.f.chequeOtros.setErrors({
                differenceOtros: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.chequeOtros.setErrors(undefined);
        }
    }

    errorDiferenciaChequesPropios(val: number) {
        if (val != this.f.chequePropio.value) { 
            this.f.chequePropio.setErrors({
                differencePropio: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.chequePropio.setErrors(undefined);
        }
    }

    selectMotivoDevolucion(event, row: Cheque) {
        row.motivoDevolucion = (event.target as HTMLSelectElement).value;
    }

    validateSerialAccountUnique(serial: string, numeroCuentaCheque: string) {
        if (!serial || !numeroCuentaCheque) {
            return true;
        }
        return this.chequeList.find(c => (c.serial === serial) && (c.numeroCuentaCheque === numeroCuentaCheque)) == undefined;
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
                        siglas: this.cuentaOperacion.monedaSiglas
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

    calculateDifferences() {

        let valorChequePorpio = this.f.chequePropio.value ? this.f.chequePropio.value : 0.0;
        let valorChequeOtros = this.f.chequeOtros.value ? this.f.chequeOtros.value : 0.0;
        let valorMontoTotal = this.f.monto.value ? this.f.monto.value : 0.0;
        // La diferencia entre la suma de los Cheques y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        if (Math.abs((valorChequePorpio + valorChequeOtros) - (valorMontoTotal)) >= 1) {

            this.f.chequePropio.setErrors({
                chequePropioDifference: true
            });

            this.f.chequeOtros.setErrors({
                chequeOtrosDifference: true
            });

            this.f.monto.setErrors({
                totalDifference: true
            });

            this.f.monto.markAsDirty();

        } else {
            this.f.monto.setErrors(undefined);
        }
    }

    reset() {
        this.itemForm.reset({});
    }
}

