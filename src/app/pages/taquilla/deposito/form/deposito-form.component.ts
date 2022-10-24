import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Cheque, Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'app-deposito-form',
    templateUrl: './deposito-form.component.html',
    styleUrls: ['./deposito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {

    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public chequeForm: FormGroup;
    cheques: ReplaySubject<Cheque[]> = new ReplaySubject<Cheque[]>();
    chequeList: Cheque[] = [];
    cheque: Cheque = {} as Cheque;
    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    todayValue: moment.Moment;
    numCuenta: string = "";
    tipoProducto: string = "";
    detalleEfectivo: number = 0;
    // esCheque: boolean = false;
    // esEfectivo: boolean = false;
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
                this.loadingDataForm.next(true);
                this.buildForm();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.tipoDocumentoService.actives().subscribe(data => {
                    this.tiposDocumentos.next(data);
                });

                if (this.f.tipoDocumento.value == "") {
                    this.f.identificacion.disable();
                    this.f.esEfectivo.enable();
                    this.f.esCheque.disable();
                }

                this.f.tipoDocumento.valueChanges.subscribe(val => {
                    if (val) {
                        this.f.identificacion.enable()
                    }

                    this.f.identificacion.reset();
                    this.persona = {} as Persona;
                    this.cuentaOperacion = {} as CuentaBancariaOperacion;
                    this.cuentasBancarias.next([]);
                    this.f.cuentaBancaria.setValue(undefined);
                    this.f.esEfectivo.enable();
                    this.f.esCheque.disable();
                    this.f.esEfectivo.setValue(true);
                    this.f.esCheque.setValue(false);
                })


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
                        this.calculateDifferences();
                    }
                })

                this.f.chequeOtros.valueChanges.subscribe(val => {
                    if (val) {
                        this.calculateDifferences();
                    }
                })

                //TODO: Revisar
                this.f.cuentaBancaria.valueChanges.subscribe(val => {
                    if (val) {
                        //obtiendo el unico resultado seleccionado al aplicar el filtro
                        this.cuentaOperacion = this.cuentasBancarias.value.filter(e => e.id == val)[0] as CuentaBancariaOperacion;
                        this.f.esEfectivo.enable()
                        this.f.esCheque.enable()
                        this.moneda.id = this.cuentaOperacion.moneda;
                        this.moneda.nombre = this.cuentaOperacion.monedaNombre;
                    }
                })

                this.f.esCheque.valueChanges.subscribe(val => {
                    if (val) {
                        this.buildChequeForm();
                    } else {
                        this.f.chequePropio.setValue(undefined);
                        this.f.chequePropio.setErrors(undefined);
                        this.f.chequeOtros.setValue(undefined);
                        this.f.chequeOtros.setErrors(undefined);
                        this.itemForm.controls['monto'].setErrors({
                            totalDifference: true
                        });
                    }
                })

                // if(){

                // }




                // manejo de escritura en el campo identificacion
                this.f.identificacion.valueChanges.pipe(
                    distinctUntilChanged(),
                    debounceTime(500)
                ).subscribe(() => {
                    // se busca los dato que el usuario suministro      
                    const tipoDocumento = this.f.tipoDocumento.value;
                    const identificacion = this.f.identificacion.value;
                    if (tipoDocumento && identificacion) {
                        this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                            this.persona = data;
                            const numper = data.numper;

                            this.cuentaBancariaService.activesByNumper(numper).subscribe(cuenta => {
                                this.cuentasBancarias.next(cuenta);
                            });

                            this.cdr.markForCheck();
                        }, err => {
                            this.f.identificacion.setErrors({ notexists: true });
                            this.persona = {} as Persona;
                            this.cuentasBancarias.next([]);
                            this.cuentaOperacion = {} as CuentaBancariaOperacion;
                            this.f.cuentaBancaria.setValue(undefined);
                            this.f.esEfectivo.enable();
                            this.f.esEfectivo.setValue(true);
                            this.f.esCheque.disable();
                            this.f.esCheque.setValue(false);
                            this.cdr.detectChanges();

                            // prueba------------------------------------------------------------------------
                            this.f.monto.setValue('');
                            this.f.efectivo.setValue(undefined);
                            this.f.referencia.setValue('');
                            this.f.email.setValue('');
                            this.f.telefono.setValue('');
                            // Chequeeeees
                            this.f.chequeOtros.setValue(undefined);
                            this.f.chequePropio.setValue(undefined);
                            // this.f.numeroCuentaCheque.setValue('');
                            this.cf.serial.setValue('');
                            this.cf.fechaEmision.setValue('');
                            this.cf.tipoDocumentoCheque.setValue('');
                            this.cf.codigoSeguridad.setValue('');
                            this.cf.montoCheque.setValue('');
                            // fin-----------------------------------------------------------------------------
                        })
                    }
                });

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

        // this.f.esCheque.valueChanges.subscribe(val => {
        //     if (val) {
        //         this.save()
        //     }
        // })





        // if(this.f.esCheque.valueChanges && this.f.esEfectivo.disable()){
        //     this.save()
        // }else if(this.f.esCheque.disable() && this.f.esEfectivo.enable()){
        //     this.save()
        // }else if(this.f.esCheque.enable() && this.f.esEfectivo.enable()){
        //     this.save()
        // }
    }



    calculateDifferences() {


        // if (this.f.monto.value != this.detalleEfectivo) {
        //     this.itemForm.controls['monto'].setErrors({
        //         difference: true
        //     });
        //     this.cdr.detectChanges();
        // } else {
        //     this.f.monto.setErrors(undefined);
        // }

        // if(esCheque){
        //     console.log("HOLAAAAAAAAAAAAAAAAAAAAa");

        // }


        

        console.log(' this.valorEfectivo ', this.f.efectivo.value ? ' si tengo ' : ' no tengo');
        console.log(' this.valorChequePropio ', this.f.chequePropio.value ? ' si tengo ' : ' no tengo');
        console.log(' this.valorChequeOtros ', this.f.chequeOtros.value ? ' si tengo ' : ' no tengo');

        let valorEfectivo = this.f.efectivo.value ? this.f.efectivo.value : 0;
        let valorChequePropio = this.f.chequePropio.value ? this.f.chequePropio.value : 0;
        let valorChequeOtros = this.f.chequeOtros.value ? this.f.chequeOtros.value : 0;

        // TODO: Hacer algo asi chequear que si es cheque la suma de los campos debe ser mayor a cero
        if (this.f.esCheque.valueChanges && (valorChequePropio + valorChequeOtros > 0)) {
            console.log(' STEAR EL ERROR DE CHEQUE SIN VALOR');
            
        }

        if (valorEfectivo + valorChequePropio + valorChequeOtros != this.f.monto.value) {
            this.itemForm.controls['monto'].setErrors({
                totalDifference: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.monto.setErrors(undefined);
        }
    }

    buildForm() {
        this.itemForm = this.fb.group({

            nombre: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numeroCuenta: new FormControl(undefined),
            moneda: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            efectivo: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            monto: new FormControl('', Validators.required),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            referencia: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            esEfectivo: new FormControl(true),
            esCheque: new FormControl(false),
            // btnEfectivo: new FormControl(true),
            telefono: new FormControl(''),
            email: new FormControl(''),
            // cantidadPropio: new FormControl(deposito. undefined, [Validators.required]),
            // cantidadOtros: new FormControl(deposito undefined, [Validators.required]),
            // libreta: new FormControl(de '', [Validators.required]),
            // linea: new FormControl( '', [Validators.required]),
            chequeOtros: new FormControl(undefined),
            chequePropio: new FormControl(undefined),

        });

        this.f.esEfectivo.valueChanges.subscribe(val => {
            if (!val) {
                this.f.efectivo.setValue(undefined);
                this.f.efectivo.setErrors(undefined);
                this.conoActual = [];
                this.conoAnterior = [];
                this.itemForm.controls['monto'].setErrors({
                    totalDifference: true
                });
            }
        })

    }

    buildChequeForm() {

        this.chequeForm = this.fb.group({
            numeroCuentaCheque: new FormControl(undefined),
            montoCheque: new FormControl(undefined),
            serial: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            fechaEmision: new FormControl(''),
            tipoDocumentoCheque: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            codigoSeguridad: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
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
        // this.chequeForm.value.fechaEmision = this.chequeForm.value.fechaEmision.format('DD/MM/YYYY');
        this.chequeList.push(cheque);
        this.cheques.next(this.chequeList.slice());
        this.chequeForm.reset({});
    }

    delete(row) {
        this.swalService.show('Desea Eliminar El Cheque', '').then((resp) => {
            if (!resp.dismiss) {

                this.chequeList.forEach((e, index) => {
                    if (e.serial + e.numeroCuentaCheque === row.serial + row.numeroCuentaCheque) {
                        console.log(index);
                        this.chequeList.splice(index, 1);
                        this.cheques.next(this.chequeList.slice());
                    }
                });
            }
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);
        this.updateDataFromValues(this.deposito, this.persona);
        this.updateDataFromValues(this.deposito, this.cuentaOperacion);
        this.deposito.detalles = this.conoActual.concat(this.conoAnterior);
        this.deposito.cheques = this.chequeList;
        this.saveOrUpdate(this.depositoService, this.deposito, 'El Deposito');
        this.conoActual = [];
        this.conoAnterior = [];
        this.detalleEfectivo = 0;
        this.detalleEfectivo = 0;
        this.detalleEfectivo = 0;
        this.detalleEfectivo = 0;
        this.f.identificacion.disable();
        this.cheque= {} as Cheque;

        this.cdr.detectChanges();
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }

        this.f.efectivo.setValue(event.montoTotal);
        this.conoActual = event.desgloseConoActual;
        this.conoAnterior = event.desgloseConoAnterior;
        this.cdr.detectChanges();
    }
}