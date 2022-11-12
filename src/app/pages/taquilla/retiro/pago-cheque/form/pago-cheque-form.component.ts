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
import { matFormFieldAnimations } from '@angular/material/form-field';
import { formatNumber } from '@angular/common';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';

@Component({
    selector: 'app-pago-cheque-form',
    templateUrl: './pago-cheque-form.component.html',
    styleUrls: ['./pago-cheque-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PagoChequeFormComponent extends FormBaseComponent implements OnInit {

    retiro: Retiro = {} as Retiro;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]); //lista  
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    esPagoCheque: boolean = true;
    esPagoChequeGerencia: boolean = false;
    esRetiroEfectivo: boolean = false;
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
                            this.moneda.id = this.cuentaBancariaOperacion.moneda;
                            this.moneda.nombre = this.cuentaBancariaOperacion.monedaNombre; 
                            this.moneda.siglas = this.cuentaBancariaOperacion.monedaSiglas;  
                            // Se llama a la funcion para verificar si hay saldo en taquilla para la moneda  
                             this.saldoByMoneda(this.moneda);
                            this.persona.nombre = this.cuentaBancariaOperacion.nombre;                           
                            
                            console.log("DATOS", data);

                            this.f.tipoDocumentoBeneficiario.setValue(GlobalConstants.PN_TIPO_DOC_DEFAULT);
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
                            //this.f.fechaEmision.reset();
                            //this.f.codSeguridad.reset();
                            this.f.identificacionBeneficiario.reset();
                            this.f.email.reset();
                            this.tipoDocumentos.next([]);
                           // this.f.telefono.reset();
                            this.f.tipoDocumentoBeneficiario.setValue(undefined)
                            this.cdr.detectChanges();

                        })
                    }
                });
                //} //fin


                this.f.identificacionBeneficiario.valueChanges.subscribe(val => {
                    if(val){
                        console.log('entro ');  
                        if(this.f.identificacionBeneficiario.value === this.cuentaBancariaOperacion.identificacion){

                            console.log('identif ', this.cuentaBancariaOperacion.identificacion);
                            // this.f.tipoDocumentoDepositante.setValue(this.f.tipoDocumento);
                            //this.f.nombreDepositante.setValue(this.persona.nombre);
                            this.f.email.setValue(this.cuentaBancariaOperacion.email);
                            this.cdr.detectChanges();
                        }else{
                           // this.f.nombreDepositante.setValue('');
                            this.f.email.setValue('');
                            this.cdr.detectChanges();
                        }
                    }
                })

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

   
    calculateDifferences(event?: any) {  

        // let valorEfectivo = this.f.montoCheque.value > 0 ? this.f.montoCheque.value : 0;        
        // if (valorEfectivo != (event ? (event.montoTotal > 0 ? event.montoTotal : this.f.monto.value) : this.f.monto.value)) {
        //     this.f.monto.setErrors({
        //         totalDifference: true
        //     });
        //     this.f.monto.markAsDirty();
        //     this.f.montoCheque.setErrors({
        //         difference: true
        //     });
        //     this.f.montoCheque.markAsDirty();
        //     if (event && event.montoTotal > 0) {
        //         this.f.monto.setValue(event.montoTotal);
        //     }
        // } else {
        //     if (event && event.montoTotal > 0) {
        //         this.f.monto.setValue(event.montoTotal);
        //     }
        //     this.f.monto.setErrors(undefined);
        //     this.f.montoCheque.setErrors(undefined);
        // }
        let valorEfectivo = this.f.monto.value > 0 ? this.f.monto.value : 0;

        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos 
        if ( Math.abs(valorEfectivo - (event ? (event.montoTotal > 0 ? event.montoTotal : this.f.montoCheque.value) : this.f.montoCheque.value)) >= 1) {
            this.f.montoCheque.setErrors({
                totalDifference: true
            });
            this.f.montoCheque.markAsDirty();
            this.f.monto.setErrors({
                difference: true
            });
            this.f.monto.markAsDirty();
            if (event && event.montoTotal > 0) {
                this.f.montoCheque.setValue(event.montoTotal);
            }

        } else {

            if (event && event.montoTotal > 0) {
                this.f.montoCheque.setValue(event.montoTotal);
            }
            this.f.montoCheque.setErrors(undefined);
               this.f.monto.setErrors(undefined);
        }
     
     
    }



    buildForm() {

        this.itemForm = this.fb.group({        

  
            numper: new FormControl(undefined),
            tipoDocumentoBeneficiario: new FormControl(undefined, [Validators.required]),
            identificacionBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl('', [Validators.required]),
            moneda: new FormControl(''),
            tipoProducto: new FormControl(''),
            serialCheque: new FormControl(undefined, [ Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl(''),           
            email: new FormControl(undefined,),
                 

        });


    }


    updateCashDetail(event) {
       // console.log('update cash detail ', event)
        if (!event) {
            return;
        }
        this.calculateDifferences(event);

        this.conoActual = event.desgloseConoActual;
        this.conoAnterior = event.desgloseConoAnterior;
        this.cdr.detectChanges();
       /* this.detalleEfectivo = event.montoTotal;
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
        this.cdr.detectChanges();*/

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
            this.f.beneficiario.setValue(undefined);
            this.f.comprador.setValue(undefined);
            //this.f.tipoDocumento.setValue(undefined);            

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
          
        }
    }

  

    save() {

        if (this.itemForm.invalid)
            return;
        
        this.updateData(this.retiro);

        let montoFormat = formatNumber(this.retiro.monto, 'es', '1.2');


        this.swalService.show('¿Desea Realizar el Pago de Cheque?', undefined,
            { 'html': 'Titular: <b>' + this.persona.nombre + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' +this.moneda.siglas + '</b>' }
        ).then((resp) => {
            if (!resp.dismiss) {
        
                this.updateDataFromValues(this.retiro, this.persona);
                this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
                this.retiro.cuentaBancaria = this.cuentaBancariaOperacion.id;
                this.retiro.tipoDocumento = this.cuentaBancariaOperacion.tipoDocumento;
                this.retiro.tipoDocumentoCheque = GlobalConstants.CHEQUE;      
                //this.retiro.fechaEmision = this.retiro.fechaEmision?this.retiro.fechaEmision.format('DD/MM/YYYY'):undefined;  
                //this.retiro.codSeguridad = this.retiro.codSeguridad;                this.retiro.detalles = this.conoActual.concat(this.conoAnterior);
                //this.retiro.telefono = this.retiro.telefono ? "04".concat(this.retiro.telefono) : undefined   
               //console.log("RETIRO   ", this.retiro);
        
                this.retiro.operacion='cheque';
        
                this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque');
                this.conoActual = [];
                this.conoAnterior = [];
                this.detalleEfectivo = 0;        

                this.router.navigate(['/sirio/welcome']).then(data => { });
            }

        })       
       
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


    resetInfoFinance() {
        this.f.numeroCuenta.reset();
        this.f.montoCheque.reset({});         
        this.f.monto.reset({});  
        this.f.serialCheque.reset();  
        this.tipoDocumentos.next([]); 
        this.f.tipoDocumentoBeneficiario.reset();     
        this.f.identificacionBeneficiario.reset();   
        this.f.email.reset();
    }
    
    
    resetInfobeneficiary(){
      
        this.f.email.reset();
        this.f.tipoDocumentoBeneficiario.reset(); 
        this.f.identificacionBeneficiario.reset();

    }
}
