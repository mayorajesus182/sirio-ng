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
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Agencia } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Retiro, RetiroService } from 'src/@sirio/domain/services/taquilla/retiro.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

import * as moment from 'moment';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { formatNumber } from '@angular/common';

@Component({
    selector: 'app-retiro-efectivo-form',
    templateUrl: './retiro-efectivo-form.component.html',
    styleUrls: ['./retiro-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RetiroEfectivoFormComponent extends FormBaseComponent implements OnInit {

    retiro: Retiro = {} as Retiro;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]); //lista  
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    //public tipoDocumentosactivos = new BehaviorSubject<TipoDocumento[]>([]);
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    esPagoCheque: boolean = false;
    esPagoChequeGerencia: boolean = false;
    esRetiroEfectivo: boolean = false;
    esEfectivo: boolean = false;
    esAbonoCuenta: boolean = false;
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

                this.f.monto.valueChanges.subscribe(val => {
                    if (val) {
                        this.calculateDifferences();
                    }
                });

                this.f.totalRetiro.valueChanges.subscribe(val => {
                    if (val) {
                        this.calculateDifferences();
                    }
                });

                this.loading$.subscribe(val => {
                    if (val) {
                        this.persona = {} as Persona;
                        this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;

                    }
                });


            }
        });
    }


    // calculateDifferences() {

    //     this.f.numeroCuenta.enable()


    //     if (this.f.monto.value != this.detalleEfectivo) {
    //         this.itemForm.controls['monto'].setErrors({
    //             difference: true
    //         });
    //         this.cdr.detectChanges();
    //     } else {
    //         this.f.monto.setErrors(undefined);
    //     }

    //     if (this.f.monto.value != this.f.totalRetiro.value) {
    //         this.itemForm.controls['totalRetiro'].setErrors({
    //             differenceMonto: true
    //         });
    //         this.itemForm.controls['monto'].setErrors({
    //             required: true
    //         });
    //         this.cdr.detectChanges();
    //     } else {
    //         this.f.totalRetiro.setErrors(undefined);
    //     }
    // }

    calculateDifferences(event?:any) {

        let valorEfectivo = this.f.monto.value > 0 ? this.f.monto.value : 0;
        // let valorChequePropio = this.f.chequePropio.value ? this.f.chequePropio.value : 0;
        // let valorChequeOtros = this.f.chequeOtros.value ? this.f.chequeOtros.value : 0;
        // (event?event.montoTotal:this.f.monto.value)
        console.log(' event ',event);
        console.log(' valor  ',valorEfectivo);
        console.log(' comparacion ',valorEfectivo != (event?event.montoTotal:this.f.totalRetiro.value));
        
        
        if (valorEfectivo != (event?(event.montoTotal > 0? event.montoTotal:this.f.totalRetiro.value):this.f.totalRetiro.value)) {
            this.f.totalRetiro.setErrors({
                totalDifference: true
            });
            this.f.totalRetiro.markAsDirty();
            this.f.monto.setErrors({
                difference: true
            });
            this.f.monto.markAsDirty();
            if(event && event.montoTotal > 0){
                this.f.totalRetiro.setValue(event.montoTotal);
            }
            // this.cdr.detectChanges();
            
        } else{
            
            if(event && event.montoTotal > 0){
                this.f.totalRetiro.setValue(event.montoTotal);
            }
            
            this.f.totalRetiro.setErrors(undefined);
            this.f.monto.setErrors(undefined);
        }
    }




    buildForm() {

        this.itemForm = this.fb.group({
            nombre: new FormControl(''),
            tipoDocumento: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl(''),
            numper: new FormControl(undefined),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl(undefined),
            cuenta: new FormControl(undefined),
            moneda: new FormControl(''),
            tipoProducto: new FormControl(''),
            totalRetiro: new FormControl(undefined),
            email: new FormControl(undefined),
            cuentaBancaria: new FormControl(undefined),
        });


        this.f.cuenta.valueChanges.subscribe(val => {
           // console.log('cuenta seleccionada ', val);

            if (val && val != '') {
                let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                console.log('cuentaselec', cuenta);                

                this.moneda.id = cuenta.moneda;
               // console.log('moneda',  this.moneda.id);  
                this.moneda.nombre = cuenta.monedaNombre;
                this.moneda.siglas = cuenta.siglas;
                this.f.tipoProducto.setValue(cuenta.tipoProducto);
                this.f.cuentaBancaria.setValue(cuenta.id);
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta);


            }
        });

                   //console.log('cuenta seleccionada ', val);
 
           //  if (this.f.cuentaBancariaOperacion ) {
                // let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                // console.log('tiene emal por busqueda cuenta',val );                
 
                //this.f.email.value 
                 //  this.moneda.id = cuenta.moneda;
                //  this.moneda.nombre = cuenta.monedaNombre;
                //  this.moneda.siglas = cuenta.siglas;
                //  this.f.tipoProducto.setValue(cuenta.tipoProducto);
                //  this.f.cuentaBancaria.setValue(cuenta.id);
                //  this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
 
 
          //   }else{  !this.f.cuentaBancariaOperacion  //busca por persona
                   
                //    this.f.email.valueChanges.subscribe(val => {
                //     console.log('emal por bus pers', val);  
                //        if (this.f.email.value  != ''){
                //         console.log('emal1', this.f.email.value);  
                //         this.f.email.disabled                      
                //     }else {
                //         console.log('emal2', this.f.email.value);  
                //         this.f.email.enable}
                // });
             
           //     }

      





    }


    updateCashDetail(event) {
        console.log('update cash detail ', event)
        if (!event) {
            return;
        }
        // this.detalleEfectivo = event.montoTotal;

        this.calculateDifferences(event);
        // this.f.monto.setValue(event.montoTotal);
    
       

        // if (this.f.monto.value != this.detalleEfectivo) {
        //     this.itemForm.controls['monto'].setErrors({
        //         difference: true
        //     });
        //     this.cdr.detectChanges();
        // } else {
        //     this.f.monto.setErrors(undefined);
        // }


        this.conoActual = event.desgloseConoActual;
        this.conoAnterior = event.desgloseConoAnterior;
        this.cdr.detectChanges();
    }

    retiroEfectivoEvaluate(event) {
        if (event.checked) {

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
            this.f.tipoDocumentoBeneficiario.setValue(undefined);

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
            this.f.tipoDocumentoBeneficiario.setValue(false);
        }
    }


    queryResult(data: any) {
        // console.log('event result ', data);
        this.itemForm.reset({});

        if (!data.id && !data.numper) {

            this.loaded$.next(false);
            this.persona = {} as Persona;
            this.cuentaBancariaOperacion = undefined;
            this.isNew = true;
            this.cuentasBancarias.next([]);
            // this.f.totalRetiro.reset(0);
            // this.f.monto.reset(0);
            // this.f.email.reset();
            this.esRetiroEfectivo = false;
            this.conoActual = [];
            this.conoAnterior = [];
            this.detalleEfectivo = 0;

            this.cdr.detectChanges();
        } else {

            this.esRetiroEfectivo = true;
            if (data.moneda) {
                //console.log("aqui-consulto por NroCuenta");
                this.cuentaBancariaOperacion = data;
                this.moneda.id = this.cuentaBancariaOperacion.moneda;
                this.moneda.nombre = this.cuentaBancariaOperacion.monedaNombre;
                this.moneda.siglas = this.cuentaBancariaOperacion.monedaSiglas;               
                this.f.cuenta.setValue(undefined);//cuenta bancaria
                this.f.numeroCuenta.setValue(this.cuentaBancariaOperacion.numeroCuenta);
                this.f.cuentaBancaria.setValue(this.cuentaBancariaOperacion.id);
                this.f.identificacion.setValue(this.cuentaBancariaOperacion.identificacion)
                this.persona.nombre = this.cuentaBancariaOperacion.nombre;
                this.f.email.setValue(this.cuentaBancariaOperacion.email);                
                //console.log("DATAcuentaBancaria", data);

            } else {
                this.esRetiroEfectivo = true;
                this.persona = data;
                this.cuentaBancariaOperacion = undefined;
                this.f.identificacion.setValue(this.persona.identificacion)
                this.f.email.setValue(this.persona.email);
                

                console.log("DATAPersona", data);

                //lista de las cuentas bancarias de la persona
                this.cuentaBancariaService.activesByPersona(this.persona.id).subscribe(data => {
                    console.log(data);

                    this.cuentasBancarias.next(data);


                })

            }
        }
    }



    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.retiro);

        let montoFormat = formatNumber(this.retiro.monto, 'es', '1.2');

        this.swalService.show('¿Desea Realizar el Retiro?', undefined,
            { 'html': 'Titular: <b>' + this.persona.nombre + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' +this.moneda.siglas + '</b>' }
        ).then((resp) => {
            if (!resp.dismiss) {
                if (this.persona) {
                    this.retiro.persona = this.persona.id;
                    this.retiro.numper = this.persona.numper;
                    this.retiro.tipoDocumento = this.persona.tipoDocumento;
                    this.retiro.identificacion = this.persona.identificacion;
                    this.retiro.nombre = this.persona.nombre;
                }
                this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);

                if (this.cuentaBancariaOperacion) {
                    this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
                    this.retiro.cuentaBancaria = this.cuentaBancariaOperacion.id;
                    this.updateDataFromValues(this.retiro, this.persona)
                }
                this.retiro.detalles = this.conoActual.concat(this.conoAnterior);
                this.retiro.moneda = this.moneda.id;
                //console.log("RETIRO   ", this.retiro);        
                this.retiro.operacion = 'efectivo';
        
                this.saveOrUpdate(this.retiroService, this.retiro, 'el retiro en efectivo');
                this.conoActual = [];
                this.conoAnterior = [];
                this.detalleEfectivo = 0;
                this.cuentasBancarias.next([]);

                this.router.navigate(['/sirio/welcome']).then(data => { });
            }

        })


    }

    /********************** */
    resetInfoFinance() {
        this.moneda.siglas = undefined;
        this.f.monto.reset({});
        this.f.totalRetiro.reset({});
        this.cuentasBancarias.next([]);
        this.cuentaBancariaOperacion = undefined;
        //this.f.numeroCuenta.reset();
       // this.cuentaBancariaOperacion.tipoProductoNombre = undefined;
        this.conoActual = [];
        this.conoAnterior = [];
        this.detalleEfectivo = 0;
    }
    resetInfoBenef(){
        this.f.email.setValue('');


    }

}
