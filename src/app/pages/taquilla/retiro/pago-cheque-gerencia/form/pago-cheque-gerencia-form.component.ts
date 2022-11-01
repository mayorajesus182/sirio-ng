import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';

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
    selector: 'app-pago-cheque-gerencia-form',
    templateUrl: './pago-cheque-gerencia-form.component.html',
    styleUrls: ['./pago-cheque-gerencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PagoChequeGerenciaFormComponent extends FormBaseComponent implements OnInit {

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
    esRetiroEfectivo: boolean = false;
    esPagoChequeGerencia: boolean = true;
    esEfectivo: boolean = false;
    esAbonoCuenta: boolean= false;
    detalleEfectivo: number = 0;
    todayValue: moment.Moment;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,
        private personaService: PersonaService,
        private calendarioService: CalendarioService,
        private taquillaService: TaquillaService,
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
                                            
                       
                    this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
                        this.tipoDocumentos.next(data);
                    });

                    }else {   
                        
                        this.f.numeroCuenta.setErrors({ validacion: true });
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
                            //this.f.monto.disable();
                            console.log("DATOS", data);
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
                //} //fin

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
            this.itemForm.controls['montoCheque'].setErrors({
                differenceMonto: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.montoCheque.setErrors(undefined);
        }
    }



    buildForm() {

        this.itemForm = this.fb.group({

            
          tipoDocumento: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
           identificacion: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),


            comprador: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
            beneficiario: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
            numper: new FormControl(undefined),
            tipoDocumentoBeneficiario: new FormControl(undefined, [Validators.required]),
            identificacionBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl('', [Validators.required]),
            moneda: new FormControl(''),
            tipoProducto: new FormControl(''),
            serialCheque: new FormControl(undefined, [ Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl(''),
            //fechaEmision: new FormControl(''),
            nombre: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            email: new FormControl(undefined,),
            telefono: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            //esEfectivo: new FormControl(false),
            conEfectivo: new FormControl(false),
            conAbonoCta: new FormControl(false),

        });

       /* this.f.conEfectivo.valueChanges.subscribe(val => {
            if (!val) {
                this.f.libreta.setValue(undefined);
                this.f.libreta.setErrors(undefined);
                this.f.linea.setValue(undefined);
                this.f.linea.setErrors(undefined);
                this.cdr.detectChanges();
            }

        })*/


    }


    updateCashDetail(event) {
        console.log('update cash detail ', event)
        if (!event) {
            return;
        }
        this.detalleEfectivo = event.montoTotal;

        this.f.monto.setValue(event.montoTotal);


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

    retiroEfectivoEvaluate(event) {
        if (event.checked) {

            this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
                this.tipoDocumentos.next(data);              
            });    
          /*  this.f.identificacion.valueChanges.pipe(
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

                        //this.cuentaBancariaService.activesByNumper(numper).subscribe(cuenta => {
                            //this.cuentaBancariaOperacion.next(cuenta);
                       // });

                        this.cdr.markForCheck();
                    }, err => {
                        this.f.identificacion.setErrors({ notexists: true });
                        this.persona = {} as Persona;
                       // this.cuentasBancarias.next([]);
                        this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;

                    })
                }
            });*/

            this.esPagoCheque = false;
            this.esPagoChequeGerencia = false;
            this.itemForm.reset();
            this.cdr.detectChanges();

        }
    }

    pagoChequeEvaluate(event) {
        if (event.checked) {
          
            this.esRetiroEfectivo = false;
            this.esPagoChequeGerencia = false;
            this.itemForm.reset();
            this.cdr.detectChanges();
            this.conoActual = [];
            this.conoAnterior = [];
            this.detalleEfectivo = 0;           
            this.f.beneficiario.setValue(null);
            this.f.comprador.setValue(null);
            this.f.tipoDocumento.setValue(undefined);
            //error": "required", "value": true 

        }
    }

    pagoChequeGerenciaEvaluate(event) {
        if (event.checked) {
            this.esRetiroEfectivo = false;
            this.esPagoCheque = false;
            this.itemForm.reset();
            this.cdr.detectChanges();
            this.conoActual = [];
            this.conoAnterior = [];
            this.detalleEfectivo = 0;
            this.f.tipoDocumento.setValue(false);
        }
    }
    efectivoEvaluate(event) {
        if (event.checked) {
            console.log("efectivo");            
            this.f.conAbonoCta.setValue(false);
        }
    }

    abonoCuentaEvaluate(event){
        if (event.checked) {
            console.log("abono");
            this.f.conEfectivo.setValue(false);
            //this.f.conAbonoCta.setValue(false);
        }
    }

    queryResult(data: any) {
        console.log('event result ', data);

        if (!data.id && !data.numper) {

            this.loaded$.next(false);
            this.persona = {} as Persona;
            this.cuentaBancariaOperacion = undefined;
            this.isNew = true;
            //this.cuentasBancarias.next([]);
            //this.f.totalRetiro.reset(0);
            this.f.monto.reset(0);
            this.f.email.reset();
           // this.esRetiroEfectivo = false;

            this.cdr.detectChanges();
        } else {

             this.esRetiroEfectivo = true;
            if (data.moneda) {
                console.log("aqui-consulto por NroCuenta");   
                this.cuentaBancariaOperacion = data;
                this.moneda.id = this.cuentaBancariaOperacion.moneda;              
                this.moneda.nombre = this.cuentaBancariaOperacion.monedaNombre;
                this.moneda.siglas = this.cuentaBancariaOperacion.monedaSiglas;
                this.f.numeroCuenta.setValue(this.cuentaBancariaOperacion.numeroCuenta);
                this.f.identificacion.setValue(this.cuentaBancariaOperacion.identificacion)      
                              
                console.log("DATAcuentaBancaria", data);               

            } else {
                this.esRetiroEfectivo = true;               
                this.persona = data;
                this.cuentaBancariaOperacion = undefined;
                this.f.identificacion.setValue(this.persona.identificacion)            
                
                //lista de las cuentas bancarias de la persona
                this.cuentaBancariaService.activesByPersona(this.persona.id).subscribe(data => {
                    console.log(data);
                    
                   // this.cuentasBancarias.next(data);
                   

                })
            
            }
        }
    }
  

    save() {

        if (this.itemForm.invalid)
            return;


        this.updateData(this.retiro);
        this.updateDataFromValues(this.retiro, this.persona);
        this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
        this.retiro.cuentaBancaria = this.cuentaBancariaOperacion.id;
        this.retiro.tipoDocumento = this.cuentaBancariaOperacion.tipoDocumento;
        this.retiro.tipoDocumentoCheque = GlobalConstants.CHEQUE_GERENCIA;    
        //this.retiro.fechaEmision = this.retiro.fechaEmision?this.retiro.fechaEmision.format('DD/MM/YYYY'):undefined;  
        //this.retiro.codSeguridad = this.retiro.codSeguridad;
        this.retiro.detalles = this.conoActual.concat(this.conoAnterior);
        console.log("RETIRO   ", this.retiro);
        this.retiro.operacion='cheque-gerencia';

        this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque de gerencia');
        this.conoActual = [];
        this.conoAnterior = [];
        this.detalleEfectivo = 0;

    }
    resetInfoFinance() {
        this.f.numeroCuenta.reset();
        this.f.montoCheque.reset({});         
        this.f.monto.reset({});  
        this.f.serialCheque.reset();  
        this.tipoDocumentos.next([]);         
    }
    resetInfobeneficiary(){
      
        this.f.email.setValue('');
        this.tipoDocumentos.next([]);
        this.f.identificacionBeneficiario.reset();
        this.f.beneficiario.reset();

    }
}
