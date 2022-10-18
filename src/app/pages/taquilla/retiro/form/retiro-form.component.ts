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
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]); //lista  
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);   
    //public tipoDocumentosactivos = new BehaviorSubject<TipoDocumento[]>([]);
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    esPagoCheque: boolean = false;
    detalleEfectivo: number = 0;
   // esAhorroLibreta: boolean = false;
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
                  if (!resp.dismiss) {}
                });
            } else {
                this.isNew = true;
                this.buildForm();
                this.loadingDataForm.next(false);
        
                //trae servicio de TIPO DE DOCUMENTOS   
                this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
                    this.tipoDocumentos.next(data);
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
                           this.moneda.id= this.cuentaBancariaOperacion.moneda;
                           this.moneda.nombre = this.cuentaBancariaOperacion.monedaNombre;
        
                            // console.log("DATOS", data);                   
                            this.cdr.markForCheck();
        
                        }, err => {
                            console.log(err);
                            this.f.cuentaBancariaOperacion.setErrors({ notexists: true });
                            this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;
                            this.cdr.markForCheck();
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
               
                if (this.f.monto.value != this.f.montoCheque.value ){
                    console.log("valor", +this.f.monto.value+ "valor2" , this.f.montoCheque.value);

                    this.itemForm.controls['montoCheque'].setErrors({
                        differenceMonto: true
                    });
                    this.cdr.detectChanges();
                }else {
                    this.f.montoCheque.setErrors(undefined);
                }

   
        }

    buildForm() {

        this.itemForm = this.fb.group({

            esPagoCheque: new FormControl(false),

            numper: new FormControl(undefined),
            tipoDocumentoBeneficiario: new FormControl( undefined, [Validators.required]),
            identificacionBeneficiario: new FormControl( '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            monto: new FormControl( '', [Validators.required]),
            numeroCuenta: new FormControl( '', [Validators.required]),
            moneda: new FormControl( ''),
            tipoProducto: new FormControl(''),
            serialCheque: new FormControl(undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoCheque: new FormControl(undefined, [Validators.required,]),
            fechaEmision: new FormControl( '', [Validators.required,]),
            codSeguridad: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            email: new FormControl( ''),
            telefono: new FormControl( ''),

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
        this.retiro.fechaEmision = this.retiro.fechaEmision.format('DD/MM/YYYY');
        this.conoActual = [];
        this.conoAnterior = [];
        this.detalleEfectivo = 0;

        console.log("DATOSS3   ", this.retiro);

        this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque');




    }

    updateCashDetail(event) {
        console.log('update cash detail ',event)
        if(!event){
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


        this.conoActual=event.desgloseConoActual;
        this.conoAnterior=event.desgloseConoAnterior;
        this.cdr.detectChanges();
      }
}
