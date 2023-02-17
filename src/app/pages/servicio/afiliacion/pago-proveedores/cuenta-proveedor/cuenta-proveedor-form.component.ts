import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
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
import { PersonaService} from 'src/@sirio/domain/services/persona/persona.service';


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
    @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Input() cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    private principal: boolean = false;
    telefonos: string[] = [];
    public chequeForm: FormGroup;
    personaJuridica: PersonaJuridica = {} as PersonaJuridica;
    IDpersona : number;
    Persona : Persona = {} as Persona;
    cantidadTelefonos: number = 0;
    telefonoService: TelefonoService;
    @Input() persona = undefined;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    public cuentasBancarias = new BehaviorSubject<CuentaBanco[]>([]);
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
        private PersonaService : PersonaService,
        private Pago_proveedoresService: pago_proveedoresService,
        protected intervinienteService: IntervinienteService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }



    ngOnInit() {


        this.Pago_proveedoresService.get().subscribe(data => {
            this.tipo_servicios.next(data);
        });




        this.itemForm = this.fb.group({
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl(undefined),
            numeroCuenta: new FormControl(undefined),
            TipoOperacion: new FormControl(undefined),
            codigo: new FormControl(undefined),
            moneda: new FormControl(undefined),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),

            email: new FormControl(this.personaJuridica.email || '', [Validators.required]),
        });

        this.cargaDatos();



        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
                this.f.moneda.setValue({
                    id: cuenta.moneda,
                    nombre: cuenta.moneda,
                    // siglas: cuenta.siglas
                });


               


                if (cuenta.id) {
                    console.log('buscando interviniente en el servidor dado el id persona', cuenta.id);

                    this.intervinienteService.allByCuentaId(cuenta.id).subscribe((data) => {
        
                        this.intervinientes = data.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
                        this.intervinienteList.next(data.filter(f=> f.tipoParticipacion == "AUTORIZADO"));
                        // this.IDpersona = Number(data.map(i => i.identificacion))
                        // this.PersonaService.get(this.IDpersona).subscribe(val => {
                        //     this.Persona = val;
                        //     //this.cdr.detectChanges();
                        // });
    


                        this.cdr.detectChanges();
                    });



                    this.onRefresh.subscribe(val => {
                        if (val) {

                            this.intervinienteService.allByCuentaId(cuenta.id).subscribe((data) => {
                              
                                this.intervinientes = data.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
                                this.intervinienteList.next(data.filter(f=> f.tipoParticipacion == "AUTORIZADO"));

                                this.cdr.detectChanges();
                            });


                        }
                    })

                }


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

                    this.f.identificacion.setValue(this.persona.identificacion);
                    this.f.tipoDocumento.setValue(this.persona.tipoDocumento);


                    this.personaJuridicaService.get(this.persona.id).subscribe(val => {
                        this.personaJuridica = val;
                        this.f.email.setValue(this.personaJuridica.email);
                       // console.log("this.personaJuridica", val);
                        this.cdr.detectChanges();
                    });


                    this.cuentaBancoService.listByPersona(this.persona.id).subscribe(data => {
                        //console.log("nueva cuenta", data)
                        this.cuentasBancarias.next(data);
                   
                        this.f.cuentaBancaria.setValue(data[0].id);
                        this.f.numeroCuenta.setValue(data[0].numeroCuenta);
                        this.f.moneda.setValue(data[0].moneda);

                     
                    });
                }
            }
        }
    }



    reset() {
        this.cargaDatos();
        this.f.efectivo.setValue(0.00);
        this.f.monto.setValue(0.00);
    }



    modal(event) {
        if (event.checked === true) {
            let cuenta = undefined;
            console.log("por aqui", cuenta)
            this.popup(cuenta);
            this.cdr.detectChanges()
        }
    }

    popup(data) {

        console.log("por aqui", data)
        this.showFormPopup(TelefonoFormPopupComponent, { data, telefonos: this.telefonos, principal: this.principal, primero: false }, true, '70%').afterClosed().subscribe(event => {
            if (event) {
                this.onRefresh.next(true);
            }
        });
    }

}



