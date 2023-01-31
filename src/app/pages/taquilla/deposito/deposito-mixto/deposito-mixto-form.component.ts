import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
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
import { ChequeService } from 'src/@sirio/domain/services/taquilla/cheque.service';
import { Cheque } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'sirio-deposito-mixto',
    templateUrl: './deposito-mixto-form.component.html',
    styleUrls: ['./deposito-mixto-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoMixtoFormComponent extends FormBaseComponent implements OnInit {
    ColumnMode = ColumnMode;
    @Input() cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    @Input() persona: Persona = {} as Persona;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();

    public chequeForm: FormGroup;
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public motivosDevoluciones: MotivoDevolucion[] = [];

    cheque: Cheque = {} as Cheque;
    chequeList: Cheque[] = [];
    cheques: ReplaySubject<Cheque[]> = new ReplaySubject<Cheque[]>();
    todayValue: moment.Moment;
    valueMin: moment.Moment;
    sumMontoChequePropio: number = 0;
    sumMontoChequeOtros: number = 0;
    contarChequePropio: number = 0;
    contarChequeOtros: number = 0;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private cuentaBancariaService: CuentaBancariaService,
        private chequeService: ChequeService,
        private calendarioService: CalendarioService,
        private sessionService: SessionService,
        private motivoDevolucionService: MotivoDevolucionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.itemForm = this.fb.group({
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl('', Validators.required),
            numeroCuenta: new FormControl('', Validators.required),
            efectivo: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
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
            conoActual: new FormControl([]),
            conoAnterior: new FormControl([]),
            detalleCheques: new FormControl(undefined)
        });


        this.cargaDatos();

        this.f.efectivo.valueChanges.subscribe(val => {
            if (val) {
                this.errorDesglose();
                this.calculateDifferences();
                this.cdr.detectChanges();
            }else if(val === null || val ==  undefined){                
                this.f.efectivo.setValue(0.00);
                this.cdr.detectChanges();
            }
        });

        this.f.chequePropio.valueChanges.subscribe(val => {
            if (val) {
                this.errorDiferenciaChequesPropios(this.sumMontoChequePropio, this.contarChequePropio);
                this.calculateDifferences();
            }else if(val === null || val ==  undefined){                
                this.f.chequePropio.setValue(0.00);
                this.cdr.detectChanges();
            }
        });

        this.f.chequeOtros.valueChanges.subscribe(val => {
            if (val) {
                this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros, this.contarChequeOtros);
                this.calculateDifferences();
            }else if(val === null || val ==  undefined){                
                this.f.chequeOtros.setValue(0.00);
                this.cdr.detectChanges();
            }
        });


        this.f.monto.valueChanges.subscribe(val => {
            if (val > 0) {
                this.errorDiferenciaChequesPropios(this.sumMontoChequePropio, this.sumMontoChequePropio);
                this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros, this.sumMontoChequeOtros);
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
            this.cf.tipoDocumentoCheque.valueChanges.subscribe(val => {
                if (val) {

                    if(val === GlobalConstants.CHEQUE_GERENCIA){
                        this.valueMin= moment(data.today, GlobalConstants.DATE_SHORT).subtract(GlobalConstants.CHEQUE_GERENCIA_FECHA_MINIMA, 'days');
                        this.cdr.detectChanges();
                    }else  if(val === GlobalConstants.CHEQUE){
                        this.valueMin= moment(data.today, GlobalConstants.DATE_SHORT).subtract(GlobalConstants.CHEQUE_FECHA_MINIMA, 'days');
                        this.cdr.detectChanges();
                    } else{
                        this.valueMin = null;
                        this.cdr.detectChanges();
                    }
                }
            })

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
            serial: new FormControl(this.cheque.serial, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numeroCuentaCheque: new FormControl(this.cheque.numeroCuentaCheque, [Validators.required]),
            tipoDocumentoCheque: new FormControl(this.cheque.tipoDocumentoCheque, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl(this.cheque.montoCheque ? this.cheque.montoCheque : ''),
            fechaEmision: new FormControl(this.cheque.fechaEmision ? moment(this.cheque.fechaEmision, 'DD/MM/YYYY') : ''),
            motivoDevolucion: new FormControl(this.cheque.motivoDevolucion),
        });

        this.cf.serial.valueChanges.subscribe(val => {
            if (val) {
                if (!this.validateSerialAccountUnique(val, this.cf.numeroCuentaCheque.value)) {
                    this.cf.serial.setErrors({
                        uniqueSerial: true
                    });
                }
            }
        });

        this.cf.numeroCuentaCheque.valueChanges.subscribe(val => {
            if (val) {
                if (!this.validateSerialAccountUnique(this.cf.serial.value, val)) {
                    this.cf.serial.setErrors({
                        uniqueSerial: true
                    });
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

        this.cf.fechaEmision.valueChanges.subscribe(val => {
            if(val && (val < this.valueMin)){
                this.cf.fechaEmision.setErrors({
                    fechaMin: true
                })
                
            }else if(val > this.todayValue){
                this.cf.fechaEmision.setErrors({
                    fechaMax: true
                })
            }else{
                this.cf.fechaEmision.setErrors(undefined);
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
            cheque.fechaEmision = cheque.fechaEmision ? cheque.fechaEmision.format('DD/MM/YYYY') : '';
            this.chequeList.push(cheque);
            this.cheques.next(this.chequeList.slice());
            this.itemForm.controls.detalleCheques.setValue(this.chequeList);
            this.chequeForm.reset({});
            this.cf.montoCheque.setValue(0.00);
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

    edit(index) {
        this.cheque = this.chequeList[index];
        this.buildChequeForm();
        this.chequeList.splice(index, 1);
        this.cheques.next(this.chequeList.slice());
        this.refresTotalCheque();
        this.cf.montoCheque ? this.cf.montoCheque : ''
        this.cdr.detectChanges();
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
        this.errorDiferenciaChequesPropios(this.sumMontoChequePropio, this.contarChequePropio);
        this.errorDiferenciaChequesOtros(this.sumMontoChequeOtros, this.contarChequeOtros);
        this.cdr.detectChanges();
    }

    // Mostrar el Icono de color Rojo, para diferenciar los 
    // Cheques Propios de Cheques Otros Bancos
    esChequePropio(row: Cheque) {
        return row ? row.numeroCuentaCheque.startsWith(this.sessionService.getUser().organizationId) : false;
    }

    errorDiferenciaChequesOtros(val: number, cont: number) {

        this.f.chequeOtros.setErrors(undefined);
        if ((cont === 0) && (this.f.chequeOtros.value > 0 && this.sumMontoChequeOtros==0)) {
            this.f.chequeOtros.setErrors({
                chequeOtrosRequired: true
            });
            this.f.chequeOtros.markAsTouched();
            this.cdr.detectChanges();
        } else if (val != this.f.chequeOtros.value) {
            this.f.chequeOtros.setErrors({
                differenceOtros: true
            });
            this.f.chequeOtros.markAsTouched();
            this.cdr.detectChanges();
        }else{
            this.f.chequeOtros.setErrors(undefined);
            this.cdr.detectChanges();
        }
    }

    errorDiferenciaChequesPropios(val: number, cont: number) {

        this.f.chequePropio.setErrors(undefined);
        if ((cont === 0) && (this.f.chequePropio.value >0 && this.sumMontoChequePropio == 0)) {
            this.f.chequePropio.setErrors({
                chequePropioRequired: true
            });
            this.f.chequePropio.markAsTouched();
            this.cdr.detectChanges();
        } else if (val != this.f.chequePropio.value) {
            this.f.chequePropio.setErrors({
                differencePropio: true
            });
            this.f.chequePropio.markAsTouched();
            this.cdr.detectChanges();
        }else {
            this.f.chequePropio.setErrors(undefined);
            this.cdr.detectChanges();
        }
    }

    selectMotivoDevolucion(event, row: Cheque) {
        row.motivoDevolucion = (event.target as HTMLSelectElement).value;
    }

    validateSerialAccountUnique(serial: string, numeroCuentaCheque: string) {
        if (!serial || !numeroCuentaCheque) {
            return true;
        }
        var validate = this.chequeList.find(c => (c.serial === serial) && (c.numeroCuentaCheque === numeroCuentaCheque)) == undefined;

        if (validate) {
            this.chequeService.exists(serial, numeroCuentaCheque).subscribe(data => {
                if (data.exists) {
                    this.cf.serial.setErrors({
                        existsSerial: true
                    });

                } else {
                    this.cf.serial.setErrors(null);
                }

                validate = !data.exists;
            });

        }
        return validate;
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

    errorDesglose(event?: any) {

        if (event === undefined || event === null) {
            this.f.efectivo.setErrors({
                differenceDesglose: true
            });
            this.f.efectivo.markAsDirty();
            this.cdr.detectChanges();
        } else if((event.montoTotal === 0)  ){
            this.f.efectivo.setErrors({
                differenceDesglose: true
            });
            this.f.efectivo.markAsDirty();
            this.cdr.detectChanges();
        } 
        else {
            this.f.efectivo.setErrors(undefined);
            this.cdr.detectChanges();
        }
    }

    calculateDifferences(event?: any) {

        let valorEfectivo = this.f.efectivo.value ? this.f.efectivo.value : 0.00;
        let valorChequePorpio = this.f.chequePropio.value ? this.f.chequePropio.value : 0.00;
        let valorChequeOtros = this.f.chequeOtros.value ? this.f.chequeOtros.value : 0.00;
        let valorMontoTotal = this.f.monto.value ? this.f.monto.value : 0.00;
        let valorTotal = Math.round(((event ? (event.montoTotal > 0 ? event.montoTotal : valorEfectivo) : valorEfectivo) + valorChequePorpio + valorChequeOtros)*100)/100;
        // La diferencia entre la suma Efectivo con los Cheques y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        if (valorTotal != valorMontoTotal) {
            this.f.monto.setErrors({
                totalDifference: true
            });
            this.f.monto.markAsDirty();
            this.cdr.detectChanges();
        } else {
            this.f.monto.setErrors(undefined);
            this.cdr.detectChanges();
        }
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }
        this.calculateDifferences(event);
        this.errorDesglose(event);
        this.f.conoActual.setValue(event.desgloseConoActual);
        this.f.conoAnterior.setValue(event.desgloseConoAnterior);
        this.cdr.detectChanges();
    }

    reset() {
        this.itemForm.reset({});
        this.chequeForm.reset({});
        this.cargaDatos();
        this.f.chequePropio.setValue(0.00);
        this.f.chequeOtros.setValue(0.00);
        this.f.efectivo.setValue(0.00);
        this.f.monto.setValue(0.00);
        this.cf.montoCheque.setValue(0.00);
        this.calculateDifferences();
        this.f.monto.setErrors({
            required: true,
        });
        this.f.monto.markAsTouched();
        this.cdr.detectChanges();
    }
    
}


