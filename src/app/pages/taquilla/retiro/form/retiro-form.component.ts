import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { CalendarDayViewComponent, CalendarEventAction } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';

import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Agencia } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Retiro, RetiroService } from 'src/@sirio/domain/services/taquilla/retiro.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

import * as moment from 'moment';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';

@Component({
    selector: 'app-retiro-form',
    templateUrl: './retiro-form.component.html',
    styleUrls: ['./retiro-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RetiroFormComponent extends FormBaseComponent implements OnInit {

    retiro: Retiro = {} as Retiro;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]); //lista  
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    // public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);   
    //public tipoDocumentosactivos = new BehaviorSubject<TipoDocumento[]>([]);
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    esPagoCheque: boolean = false;
    detalleEfectivo: number = 0;
    esPagoChequeGerencia: boolean = false;
    todayValue: moment.Moment;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,
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
                this.buildForm();
                this.loadingDataForm.next(false);

                //trae servicio de TIPO DE DOCUMENTOS   
                /* this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
                     this.tipoDocumentos.next(data);
                 });*/

                this.f.numeroCuenta.valueChanges.subscribe(val => {
                    if (val) {
                        this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
                            this.tipoDocumentos.next(data);
                        });

                    }
                })

                /* if (this.f.email.value == '' || this.f.telefono.value ==  ''){
                     this.itemForm.controls['email'].setErrors({
                         validacion: true
                         
                     });
                 }else {
                     this.f.email.setErrors(undefined);
                 }
 */

                this.f.email.valueChanges.subscribe(val => {

                    console.log("email", this.f.email.errors);

                    if (val && this.f.email.errors && this.f.email.errors.length == 0) {
                        this.validateSmsOrEmail('telefono',false);
                    }else {
                        this.validateSmsOrEmail('telefono',true);
                    }
                });

                this.f.telefono.valueChanges.subscribe(val => {

                    console.log("telef", this.f.telefono.errors);

                    if (val && this.f.telefono.errors && this.f.telefono.errors.length == 0) {
                        this.validateSmsOrEmail('email',false);
                    }else {
                        this.validateSmsOrEmail('email',true,);
                    }
                });



                    this.f.monto.valueChanges.subscribe(val => {
                        if (val) {
                            this.calculateDifferences();
                        }
                    });

                    this.f.montoCheque.valueChanges.subscribe(val => {
                        if (val) {
                            this.calculateDifferences();
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
                                this.cuentaBancariaOperacion = data;
                                //const moneda = data.moneda;
                                // const monedaNombre = data.monedaNombre;
                                this.moneda.id = this.cuentaBancariaOperacion.moneda;
                                this.moneda.nombre = this.cuentaBancariaOperacion.monedaNombre;
                                // console.log("DATOS", data);                   
                                this.cdr.markForCheck();

                            }, err => {
                                //console.log(err);
                                this.f.numeroCuenta.setErrors({ notexists: true });
                                this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;
                                this.persona = {} as Persona;
                                this.conoActual = [];
                                this.conoAnterior = [];
                                this.detalleEfectivo = 0;
                                this.f.serialCheque.reset();
                                this.f.montoCheque.reset(0);
                                this.f.monto.reset(0);
                                this.f.fechaEmision.reset();
                                this.f.codSeguridad.reset();
                                this.f.identificacionBeneficiario.reset();
                                this.f.email.reset();
                                this.tipoDocumentos.next([]);
                                this.f.telefono.reset();
                                this.f.tipoDocumentoBeneficiario.setValue(undefined)
                                this.cdr.detectChanges();

                            })
                        }
                    });


                    this.loading$.subscribe(val => {
                        if (val) {
                            this.persona = {} as Persona;
                            this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;

                        }
                    });

                    this.calendarioService.today().subscribe(data => {
                        this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
                        this.cdr.detectChanges();
                    });
                }
        });
    }


    calculateDifferences() {

        this.f.numeroCuenta.enable()

        if (this.f.monto.value != this.detalleEfectivo) {
            this.itemForm.controls['monto'].setErrors({
                difference: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.monto.setErrors(undefined);
        }

        if (this.f.monto.value != this.f.montoCheque.value) {
            //console.log("valor", +this.f.monto.value + "valor2", this.f.montoCheque.value);

            this.itemForm.controls['montoCheque'].setErrors({
                differenceMonto: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.montoCheque.setErrors(undefined);
        }
    }

   private  validateSmsOrEmail(fieldName: string, required: boolean, validator?:any ) {
     

       if (required){
            this.f[fieldName].setValidators([Validators.required]);
            //this.f[fieldName].updateValueAndValidity();
        }else{
            this.f[fieldName].clearValidators();
            //this.f[fieldName].updateValueAndValidity();
            this.f[fieldName].setErrors(null);
        }

        //this.f[fieldName].updateValueAndValidity();
        //this.f[fieldName].setValue(value == undefined ? undefined : value);
        this.cdr.detectChanges();

    }


    buildForm() {

        this.itemForm = this.fb.group({

            esPagoCheque: new FormControl(false),

            numper: new FormControl(undefined),
            tipoDocumentoBeneficiario: new FormControl(undefined, [Validators.required]),
            identificacionBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl('', [Validators.required]),
            moneda: new FormControl(''),
            tipoProducto: new FormControl(''),
            serialCheque: new FormControl(undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl('', [Validators.required,]),
            fechaEmision: new FormControl(''),
            codSeguridad: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            email: new FormControl(undefined, [Validators.required]),
            telefono: new FormControl(undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),

        });


    }


    save() {


        if (this.itemForm.invalid)
            return;


        this.updateData(this.retiro);
        this.updateDataFromValues(this.retiro, this.persona);
        this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
        this.retiro.cuentaBancaria = this.cuentaBancariaOperacion.id;
        this.retiro.tipoDocumento = this.cuentaBancariaOperacion.tipoDocumento;
        this.retiro.tipoDocumentoCheque = this.cuentaBancariaOperacion.tipoDocumento;
        this.retiro.fechaEmision = this.retiro.fechaEmision.format('DD/MM/YYYY');
        this.retiro.detalles = this.conoActual.concat(this.conoAnterior);

        console.log("RETIRO   ", this.retiro);

        this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque');
        this.conoActual = [];
        this.conoAnterior = [];
        this.detalleEfectivo = 0;



    }

    updateCashDetail(event) {
        console.log('update cash detail ', event)
        if (!event) {
            return;
        }
        this.detalleEfectivo = event.montoTotal;

        if (this.f.monto.value != this.detalleEfectivo) {
            this.itemForm.controls['monto'].setErrors({
                difference: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.monto.setErrors(undefined);
        }


        this.conoActual = event.desgloseConoActual;
        this.conoAnterior = event.desgloseConoAnterior;
        this.cdr.detectChanges();
    }
}
