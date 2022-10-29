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
    esRetiroEfectivo: boolean = true;
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
            if (isOpen) {
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

        if (this.f.monto.value != this.f.totalRetiro.value) {
            this.itemForm.controls['totalRetiro'].setErrors({
                differenceMonto: true
            });
            this.cdr.detectChanges();
        } else {
            this.f.totalRetiro.setErrors(undefined);
        }
    }



    buildForm() {

        this.itemForm = this.fb.group({

            tipoDocumento: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            // identificacion: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),


          //  comprador: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
          //  beneficiario: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
            numper: new FormControl(undefined),
           // tipoDocumentoBeneficiario: new FormControl(undefined, [Validators.required]),
           // identificacionBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required]),
            numeroCuenta: new FormControl(undefined, [Validators.required]),
            cuenta: new FormControl(undefined),
            moneda: new FormControl(''),
            tipoProducto: new FormControl(''),
            //serialCheque: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            totalRetiro: new FormControl(''),
            //fechaEmision: new FormControl(''),
           // codSeguridad: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            email: new FormControl(undefined,),
           // telefono: new FormControl(undefined, [Validators.pattern(RegularExpConstants.NUMERIC)]),
            //esEfectivo: new FormControl(false),
            //esAbonoCuenta: new FormControl(false),

        });


        this.f.cuenta.valueChanges.subscribe(val => {
            console.log('cuenta seleccionada ',val);
            
            if (val && val !='') {
                let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                // console.log('cuenta', cuenta);                

                this.moneda.id = cuenta.moneda;
                //console.log("monedaid", this.moneda.id);                
                this.moneda.nombre = cuenta.monedaNombre;

                this.f.tipoProducto.setValue(cuenta.tipoProducto);
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta); 
            }
        });


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
            this.f.tipoDocumentoBeneficiario.setValue(false);
        }
    }


    queryResult(data: any) {
        console.log('event result ', data);

        if (!data.id && !data.numper) {

            this.loaded$.next(false);
            this.persona = {} as Persona;
            this.cuentaBancariaOperacion = undefined;
            this.isNew = true;
            this.cdr.detectChanges();
        } else {

            if (data.moneda) {
                console.log("aqui-consulto por NroCuenta");   
                this.cuentaBancariaOperacion = data;
                
                console.log("DATAcuentaBancaria", data);
                //let tipoProducto= this.cuentaBancariaOperacion.tipoProducto;

            } else {

                console.log("consulta por persona");
                this.persona = data;

                this.cuentaBancariaOperacion = undefined;
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
       
        if(this.persona){
            console.log("PERSONA");

               this.retiro.persona= this.persona.id;
               this.retiro.numper= this.persona.numper;
               this.retiro.tipoDocumento=this.persona.tipoDocumento;
              // this.retiro.identificacion =this.persona.
               this.retiro.nombre = this.persona.nombre;

               //this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
        }
        // this.updateDataFromValues(this.retiro, this.persona)

    

      
        if(this.cuentaBancariaOperacion){
            console.log("CUENTA");

            this.updateDataFromValues(this.retiro, this.cuentaBancariaOperacion);
            // this.updateDataFromValues(this.retiro, this.persona)
        }
      
        //this.retiro.tipoProducto = this.cuentaBancariaOperacion.tipoProducto;      
       // this.retiro.tipoDocumento = this.cuentaBancariaOperacion.tipoDocumento;
        //this.retiro.tipoDocumentoCheque = this.cuentaBancariaOperacion.tipoDocumento;
       // this.retiro.fechaEmision = this.retiro.fechaEmision ? this.retiro.fechaEmision.format('DD/MM/YYYY') : undefined;
        //this.retiro.codSeguridad = this.retiro.codSeguridad;
        this.retiro.detalles = this.conoActual.concat(this.conoAnterior);
        this.retiro.moneda= this.moneda.id;
        console.log("RETIRO   ", this.retiro);

        this.retiro.operacion='efectivo';

        this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque');
        this.conoActual = [];
        this.conoAnterior = [];
        this.detalleEfectivo = 0;

    }
}