import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject,ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import { TelefonoFormPopupComponent } from '../popup/telefono-form.popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Interviniente, IntervinienteService } from 'src/@sirio/domain/services/persona/interviniente/interviniente.service';
import { GlobalConstants } from 'src/@sirio/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { pago_proveedoresService, Tipo_Servicio } from 'src/@sirio/domain/services/servicio/pago-proveedores.service';
import { PersonaJuridica, PersonaJuridicaService } from 'src/@sirio/domain/services/persona/persona-juridica.service';



@Component({
    selector: 'sirio-cuenta-proveedor',
    templateUrl: './cuenta-proveedor-form.component.html',
    styleUrls: ['./cuenta-proveedor-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})



export class DepositoEfectivoFormComponent extends FormBaseComponent implements OnInit {
    public ColumnMode = ColumnMode;
    intervinienteList: ReplaySubject<Interviniente[]> = new ReplaySubject<Interviniente[]>();
    @Input() cuenta = undefined;
    @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
    @Input() cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    private principal: boolean = false;
    telefonos:string[]=[];
    public chequeForm: FormGroup;
    personaJuridica: PersonaJuridica = {} as PersonaJuridica;
    cantidadTelefonos: number = 0;
    telefonoService : TelefonoService;
    @Input() persona=undefined;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    public cuentasBancarias = new BehaviorSubject<CuentaBanco[]>([]);
    //public personaJuridica = new BehaviorSubject<PersonaJuridica>(1);
    public TipoOperacion = new BehaviorSubject<String[]>([]);
    cuentaBanco: CuentaBanco = {} as CuentaBanco;
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    intervinientes: string[] = [];
    tipoFirmaCurr = '01';
    multipleFirmantes: boolean = false;
    todayValue: moment.Moment;
    valueMin: moment.Moment;
    tipo_servicios = new BehaviorSubject<Tipo_Servicio[]>([]);
    constructor(
        injector: Injector,
        protected router: Router,
        private personaJuridicaService: PersonaJuridicaService,
        protected dialog: MatDialog,
        private cuentaBancoService: CuentaBancoService,
        private fb: FormBuilder,
        private Pago_proveedoresService: pago_proveedoresService,
        //public TipoOperacion : string,
       // private cuentaBancariaService: CuentaBancariaService,
        protected intervinienteService: IntervinienteService,
       // private calendarioService: CalendarioService,
       // private sessionService: SessionService,
       // private motivoDevolucionService: MotivoDevolucionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }


     
    private loadList() {
        
        this.intervinienteService.allByCuentaId(this.cuenta.id).subscribe((data) => {
          console.log(data);
          this.intervinientes = data.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
          this.multipleFirmantes = data.filter(f => f.tipoFirma != GlobalConstants.TIPO_FIRMA_UNICA).length > 0;// verificar si la firma es conjunta o separada
    
          this.intervinienteList.next(data.slice());
          // this.propagar.emit(data.length);
          this.cdr.detectChanges();
        });
      }

    ngOnInit() {

     
        this.Pago_proveedoresService.get().subscribe(data => {
            console.log("tipo_servicios",data)
            this.tipo_servicios.next(data);
        });

      
       

        this.itemForm = this.fb.group({
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl(undefined),
            numeroCuenta: new FormControl(undefined),
            moneda: new FormControl(undefined),
            efectivo: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            monto: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            conoActual: new FormControl([]),
            conoAnterior: new FormControl([]),
            operacion: new FormControl(''),
            email: new FormControl(this.personaJuridica.email || '', [Validators.required]),
        });

        this.cargaDatos();



        this.f.efectivo.valueChanges.subscribe(val => {
            if (val) {
                this.calculateDifferences();
            } else if (val === null || val == undefined) {
                this.f.efectivo.setValue(0.00);
                this.cdr.detectChanges();
            }
        });

        //Me trae la data de la cuenta que se selecciono
        //this.TipoOperacion = "hola";
        //this.TipoOperacion.
        //this.TipoOperacion.next(this.intervinientes) //setValue("Pago Proveedores");
        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
                this.f.moneda.setValue({
                    id: cuenta.moneda,
                    nombre: cuenta.moneda,
                   // siglas: cuenta.siglas
                });
                this.f.tipoProducto.setValue(cuenta.tipoProducto);
               
            

                // this.cuentaBancoService.getByPersona(this.persona.id).subscribe(cuenta => {
                //     this.isNew = false;
                //     this.cuentaBanco = cuenta;

                // }, err => {
                //     this.isNew = true;
                //     this.loadingDataForm.next(false);
                // });




               
                if (cuenta.id) {
                    console.log('buscando interviniente en el servidor dado el id persona',cuenta.id);
                    
                    this.intervinienteService.allByCuentaId(cuenta.id).subscribe((data) => {
                        console.log(data);
                        this.intervinientes = data.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
                        this.multipleFirmantes = data.filter(f => f.tipoFirma != GlobalConstants.TIPO_FIRMA_UNICA).length > 0;// verificar si la firma es conjunta o separada
                  
                        this.intervinienteList.next(data.slice());
                        // this.propagar.emit(data.length);
                        this.cdr.detectChanges();
                      });

                    //this.loadList();
              
                    this.onRefresh.subscribe(val => {
                      if (val) {

                        this.intervinienteService.allByCuentaId(cuenta.id).subscribe((data) => {
                            console.log(data);
                            this.intervinientes = data.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
                            this.multipleFirmantes = data.filter(f => f.tipoFirma != GlobalConstants.TIPO_FIRMA_UNICA).length > 0;// verificar si la firma es conjunta o separada
                      
                            this.intervinienteList.next(data.slice());
                            // this.propagar.emit(data.length);
                            this.cdr.detectChanges();
                          });

                        //this.loadList();
                      }
                    })
              
                  }
               




                // if (cuenta.numeroCuenta) {
                //     console.log('buscando interviniente en el servidor dado el id persona');
                //    var cuenta2 =  parseInt(cuenta.numeroCuenta)
                //     this.intervinienteService.allByCuentaId(cuenta2).subscribe((cuenta2) => {
                //         console.log(cuenta2);
                //         this.intervinientes = cuenta2.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
                //         this.multipleFirmantes = cuenta2.filter(f => f.tipoFirma != GlobalConstants.TIPO_FIRMA_UNICA).length > 0;// verificar si la firma es conjunta o separada
                  
                //         this.intervinienteList.next(cuenta2.slice());
                //         // this.propagar.emit(data.length);
                //         this.cdr.detectChanges();
                //       });
              
                //     this.onRefresh.subscribe(val => {
                //       if (val) {
              
                //       //  this.loadList();
                //       }
                //     })
              
                //   }
                
    

            }
            
            

        });


        
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
        this.itemForm.valueChanges.subscribe(val => {
            if (val) {
                this.result.emit(this.itemForm)
            }
        })
    }

    cargaDatos() {

        console.log("persona",this.persona);
        console.log("cuentaOperacion",this.cuentaOperacion);
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
                    //this.cuentaOperacion = undefined;
                    this.f.identificacion.setValue(this.persona.identificacion);
                    this.f.tipoDocumento.setValue(this.persona.tipoDocumento);
                    //  public availableLangs = [] as Idioma[];
                    //this.cuentaBancariaService.activesByNumper(this.persona.numper).subscribe(data => {
                    // console.log("this.persona",this.persona)

                    this.personaJuridicaService.get(this.persona.id).subscribe(val => {
                       // this.personaJuridica(val);
                       this.personaJuridica = val;
                       this.f.email.setValue(this.personaJuridica.email);
                        console.log("this.personaJuridica",val);
                        this.cdr.detectChanges();
                    });


                    this.cuentaBancoService.listByPersona(this.persona.id).subscribe(data => {
                        console.log("nueva cuenta",data)
                        this.cuentasBancarias.next(data);
                        //this.TipoOperacion.next();
                        //if (data.length === 1) {
                            this.f.cuentaBancaria.setValue(data[0].id);
                            this.f.numeroCuenta.setValue(data[0].numeroCuenta);
                            this.f.moneda.setValue(data[0].moneda);
                        
                        //}
                    });
                }
            }
        }
    }


    calculateDifferences(event?: any) {

        let valorEfectivo = this.f.efectivo.value ? this.f.efectivo.value : 0.00;
        let montoDeposito = this.f.monto.value ? this.f.monto.value : 0.00;
        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        if ((Math.abs(valorEfectivo - (event ? (event.montoTotal > 0 ? event.montoTotal : montoDeposito) : montoDeposito)) >= 1) || (event?.montoTotal === 0)) {

            this.f.efectivo.setErrors({
                difference: true
            });
            if (event && event.montoTotal > 0) {
                this.f.monto.setValue(event.montoTotal);
                this.f.monto.setErrors({
                    totalDifference: true
                });
                this.f.monto.markAsDirty();
                this.cdr.detectChanges();
            }
            this.f.monto.markAsDirty();
            this.f.efectivo.markAsDirty();
        } else {
            if (event) {
                this.f.monto.setValue(this.f.efectivo.value);
                this.f.monto.setErrors(undefined);
                this.f.efectivo.setErrors(undefined);
            } else {
                this.f.efectivo.setErrors({
                    difference: true
                });
                this.f.efectivo.markAsDirty();
            }
        }
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }
        this.f.monto.setValue(event.montoTotal);
        this.calculateDifferences(event)
        this.f.conoActual.setValue(event.desgloseConoActual);
        this.f.conoAnterior.setValue(event.desgloseConoAnterior);
        this.cdr.detectChanges();
    }

    reset() {
        this.cargaDatos();
        this.f.efectivo.setValue(0.00);
        this.f.monto.setValue(0.00);
    }



  modal(event) {
    if (event.checked === true) {
      let  cuenta = undefined;
        console.log("por aqui",cuenta)
           this.popup(cuenta);
           this.cdr.detectChanges()
    }
}

popup(data) {

    console.log("por aqui",data)
    // if(data){
    //   data.persona=this.persona;
    // }    


    // protected showFormPopup(popupComponent, data: any, _isNew: boolean, withDialog = '60%'): MatDialogRef<any> {
    //     let data_aux = { payload: undefined, title: undefined, isNew: undefined };


    this.showFormPopup(TelefonoFormPopupComponent,{data,telefonos:this.telefonos, principal: this.principal, primero: false},true,'70%').afterClosed().subscribe(event=>{
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}

}



