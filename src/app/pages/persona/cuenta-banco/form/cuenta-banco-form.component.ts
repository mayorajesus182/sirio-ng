import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { DestinoCuenta, DestinoCuentaService } from 'src/@sirio/domain/services/configuracion/producto/destino-cuenta.service';
import { MotivoSolicitud, MotivoSolicitudService } from 'src/@sirio/domain/services/configuracion/producto/motivo-solicitud.service';
import { OrigenFondo, OrigenFondoService } from 'src/@sirio/domain/services/configuracion/producto/origen-fondo.service';
import { PromedioMonto, PromedioMontoService } from 'src/@sirio/domain/services/configuracion/producto/promedio-monto.service';
import { PromedioTransaccion, PromedioTransaccionService } from 'src/@sirio/domain/services/configuracion/producto/promedio-transaccion.service';
import { TipoFirma, TipoFirmaService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firma.service';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firmante.service';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoSubproducto, TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { TipoDocumento } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PersonaReportService } from 'src/@sirio/domain/services/persona/persona-report.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cuenta-banco-form',
    templateUrl: './cuenta-banco-form.component.html',
    styleUrls: ['./cuenta-banco-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CuentaBancoFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {
    todayValue: moment.Moment;
    tipoParticipaciones = new BehaviorSubject<TipoParticipacion[]>([]);
    tipoFirmas = new BehaviorSubject<TipoFirma[]>([]);
    tipoFirmantes = new BehaviorSubject<TipoFirmante[]>([]);

    monedaVirtuales = new BehaviorSubject<Moneda[]>([]);

    totalBankReference: number;
    // totalPersonalReference: number;
    totalContact: number;
    searchForm: FormGroup;
    hasBasicData = false;
    showAddress = false;
    
    showIntervinientes = false;
    showAfiliacionP2p = false;
    showAsociarTarjeta = false;
    
    btnCreateDisabled = true;


    nombreCompletoPersona = 'FULL NAME';
    cuentaBanco: CuentaBanco = {} as CuentaBanco;
    persona: Persona = {} as Persona;
    constants = GlobalConstants;
    // estado_civil: string;
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    refreshDirecciones = new BehaviorSubject<boolean>(false);
    paises = new BehaviorSubject<Pais[]>([]);
    // nacionadades = new BehaviorSubject<Pais[]>([]);
    origenes = new BehaviorSubject<OrigenFondo[]>([]);
    destinos = new BehaviorSubject<DestinoCuenta[]>([]);
    motivos = new BehaviorSubject<MotivoSolicitud[]>([]);
    promedioTransacciones = new BehaviorSubject<PromedioTransaccion[]>([]);
    promedioMontos = new BehaviorSubject<PromedioMonto[]>([]);
    tipoProductos = new BehaviorSubject<TipoProducto[]>([]);
    tipoSubproductos = new BehaviorSubject<TipoSubproducto[]>([]);
    // monedas = new BehaviorSubject<Moneda[]>([]);
    monedaSubproducto: string = '';

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();
    // private legals: string[] = [];

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private cuentaBancoService: CuentaBancoService,
        private personaReportService: PersonaReportService,
        private tipoParticipacionService: TipoParticipacionService,
        private tipoFirmaService: TipoFirmaService,

        private tipoFirmanteService: TipoFirmanteService,
        
        private monedaService: MonedaService,
        

        private origenFondoService: OrigenFondoService,
        private destinoCuentaService: DestinoCuentaService,
        private motivoSolicitudService: MotivoSolicitudService,
        private promedioTransaccionService: PromedioTransaccionService,
        private promedioMontoService: PromedioMontoService,
        private paisService: PaisService,
        private tipoSubproductoService: TipoSubproductoService,
        private tipoProductoService: TipoProductoService,

        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    get search() {
        return this.searchForm ? this.searchForm.controls : {};
    }

    ngOnInit() {

       this.monedaService. virtualActives().subscribe(data => {
            this.monedaVirtuales.next(data);
        });

        this.paisService.actives().subscribe(data => {
            this.paises.next(data);
        });

        this.origenFondoService.actives().subscribe(data => {
            this.origenes.next(data);
        });

        this.destinoCuentaService.actives().subscribe(data => {
            this.destinos.next(data);
        });

        this.motivoSolicitudService.actives().subscribe(data => {
            this.motivos.next(data);
        });

        this.promedioTransaccionService.actives().subscribe(data => {
            this.promedioTransacciones.next(data);
        });

        this.promedioMontoService.actives().subscribe(data => {
            this.promedioMontos.next(data);
        });

        this.tipoProductoService.actives().subscribe(data => {
            this.tipoProductos.next(data);
        });

        this.tipoParticipacionService.actives().subscribe(data => {

            this.tipoParticipaciones.next(data);
            // this.cdr.detectChanges();
        })

        this.tipoFirmaService.actives().subscribe(data => {
            this.tipoFirmas.next(data);
            // this.cdr.detectChanges();
        });

        
        this.tipoFirmanteService.actives().subscribe(data => {
            this.tipoFirmantes.next(data);
            // this.cdr.detectChanges();
        });

        this.cdr.detectChanges();

    }


    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            

            if (!loading) {
                this.hasBasicData = this.cuentaBanco.id != undefined || this.cuentaBanco.numeroCuenta != undefined;


                // console.log(.value);

                if (this.itemForm && this.f.tipoProducto.value) {
                    

                    this.tipoSubproductoService.activesByTipoProductoAndTipoPersona(this.f.tipoProducto.value, this.persona.tipoPersona).subscribe(data => {
                        
                        this.tipoSubproductos.next(data);
                        this.loadMoneda(this.f.tipoSubproducto.value);

                    });
                }

                this.cdr.detectChanges();
            }
        });
    }


    buildForm() {

        this.cuentaBanco.numeroCuenta = this.isNew ? "00000000000000000000" : this.cuentaBanco.numeroCuenta;
        this.itemForm = this.fb.group({
            persona: new FormControl(this.persona.id, [Validators.required]),
            numeroCuenta: new FormControl({ value: this.cuentaBanco.numeroCuenta, disabled: true }),
            tipoProducto: new FormControl(this.cuentaBanco.tipoProducto || undefined, [Validators.required]),
            tipoSubproducto: new FormControl(this.cuentaBanco.tipoSubproducto || undefined, [Validators.required]),
            origenFondo: new FormControl(this.cuentaBanco.origenFondo || undefined, [Validators.required]),
            destinoCuenta: new FormControl(this.cuentaBanco.destinoCuenta || undefined, [Validators.required]),
            motivoSolicitud: new FormControl(this.cuentaBanco.motivoSolicitud || undefined, [Validators.required]),
            transaccionesCredito: new FormControl(this.cuentaBanco.transaccionesCredito || undefined, [Validators.required]),
            montoCredito: new FormControl(this.cuentaBanco.montoCredito || undefined, [Validators.required]),
            transaccionesDebito: new FormControl(this.cuentaBanco.transaccionesDebito || undefined, [Validators.required]),
            montoDebito: new FormControl(this.cuentaBanco.montoDebito || undefined, [Validators.required]),
            transaccionesElectronico: new FormControl(this.cuentaBanco.transaccionesElectronico || undefined, [Validators.required]),
            montoElectronico: new FormControl(this.cuentaBanco.montoElectronico || undefined, [Validators.required]),
            fondoExterior: new FormControl(this.cuentaBanco.fondoExterior || false),
            paisOrigen: new FormControl(this.cuentaBanco.paisOrigen || undefined),
            paisDestino: new FormControl(this.cuentaBanco.paisDestino || undefined),

            monedaVirtual: new FormControl(this.cuentaBanco.monedaVirtual || undefined),
            moneda: new FormControl(this.cuentaBanco.moneda || undefined, [Validators.required]),
            tipoParticipacion: new FormControl(this.cuentaBanco.tipoParticipacion || undefined, [Validators.required]),
            tipoFirma: new FormControl(this.cuentaBanco.tipoFirma || undefined, [Validators.required]),
            tipoFirmante: new FormControl(this.cuentaBanco.tipoFirmante || undefined, [Validators.required]),
            observacion: new FormControl(this.cuentaBanco.observacion || undefined,[Validators.required] ),
            montoPromedio: new FormControl(this.cuentaBanco.montoPromedio || undefined, [Validators.required]),
        });

        this.f.tipoProducto.valueChanges.subscribe(value => {
            this.f.tipoSubproducto.setValue(undefined);
            // this.f.moneda.setValue(undefined);
            // this.f.numeroCuenta.setValue('');


            if (value) {

                this.tipoSubproductoService.activesByTipoProductoAndTipoPersona(this.f.tipoProducto.value, this.persona.tipoPersona).subscribe(data => {
                    this.tipoSubproductos.next(data);
                    this.cdr.detectChanges();
                });

            }

        });


        this.f.tipoSubproducto.valueChanges.subscribe(value => {

            if (value && value != '') {
                this.loadMoneda(value);
            }
        });

        this.f.tipoFirma.valueChanges.subscribe(value => {

            if (value && value != '') {

                this.cdr.detectChanges();
            }
        });

        this.cdr.detectChanges();
    }

    private loadMoneda(subProducto) {
        // console.log("subProducto", subProducto);
        const filtered = this.tipoSubproductos.value.filter(s => s.id == subProducto);
        if (filtered.length == 0) {

            return;
        }
        let subProductoSel = filtered.reduce(a => a);
        // console.log(subProductoSel);
        if (subProductoSel) {

            this.f.moneda.setValue(subProductoSel.moneda);
            this.monedaSubproducto = subProductoSel.monedaNombre;
        }
    }

    resetAll() {
        this.cuentaBanco = {} as CuentaBanco;
        this.buildForm();
        this.loaded$.next(true);
        this.isNew = true;
    }

    cleanForm() {
        this.isNew = true;
        this.loaded$.next(false);
        // this.persona = {} as Persona;
        this.cuentaBanco = {} as CuentaBanco;
        //this.resetAll();  
    }

    loadResult(event:any) {

        //TODO: ACA DEBO CARGAR LA CUENTA QUE ESTA PROCESO PARA EL CLIENTE
        this.isNew = true;
        this.loaded$.next(false);

        console.log('event person ', event);
        

        if (!event.id && !event.numper) {
            this.isNew = true;
            this.persona = {} as Persona;
            this.resetAll();
            const tpersona = event.tipoPersona == GlobalConstants.PERSONA_JURIDICA ? 'juridica' : 'natural';
            this.router.navigate([`/sirio/persona/${tpersona}/${event.tipoDocumento}/${event.identificacion}/add`]);
        } else {
            this.persona = event;
            this.loadingDataForm.next(true);
            // TODO: POR ACA TAMBIEN EVALUAR SI EL CLIENTE REQUIERE DE ACTUALIZACIÓN Y DEBO INFORMAR AL USUARIO QUE DEBE ACTUALIZAR LA INFO Y SI EL LO ACEPTA 
            // DEBO REDIRECCIONAR AL USUARIO AL 
            this.cuentaBancoService.getByPersona(this.persona.id).subscribe(cuenta => {
                // terminar proceso de apertura de cuenta
                // console.log(cuenta);

                this.isNew = false;
                this.cuentaBanco = cuenta;
                this.buildForm();
                // this.loadMoneda(this.f.tipoSubproducto.value);
                this.loadingDataForm.next(false);
                this.loaded$.next(true);
                // this.cdr.detectChanges();
                // this.tipoSubproductoService.activesByTipoProductoAndTipoPersona(this.f.tipoProducto.value, this.persona.tipoPersona).subscribe(data => {
                //     this.tipoSubproductos.next(data);
                //     this.cdr.detectChanges();
                // });




            }, err => {
                this.isNew = true;
                this.loadingDataForm.next(false);
                this.resetAll();
            });

        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        

        this.updateData(this.cuentaBanco);

        console.log(" Observacion",this.cuentaBanco);

        // this.cuentaBanco.paisDestino='VES';
        // this.cuentaBanco.paisOrigen='VES';

        this.cuentaBanco.fondoExterior = this.f.fondoExterior.value == true ? 1 : 0;
        // this.cuentaBanco.persona = this.persona.id;

        if (this.isNew) {

            this.cuentaBancoService.save(this.cuentaBanco).subscribe(data => {
                this.cuentaBanco = data;
                this.isNew = false;
                // console.log(data);

                this.successResponse('La Cuenta Banco', 'creada', true);
                this.hasBasicData = this.cuentaBanco.id != undefined || this.cuentaBanco.numeroCuenta != undefined;
                this.cdr.detectChanges();

            }, error => this.errorResponse(true));

        } else {
            this.cuentaBancoService.update(this.cuentaBanco).subscribe(data => {

                this.successResponse('La persona', 'actualizada', true);
            }, error => this.errorResponse(false));
        }

    }

    send() {

        console.log('send data al banco');

        this.swalService.show('¿Desea realmente realizar esta operación?',).then((resp) => {

            if (!resp.dismiss) {
                this.loadingDataForm.next(true);

                this.cuentaBancoService.send(this.cuentaBanco.id).subscribe(data => {
                    this.successResponse('Operacion', 'aplicada', true);
                    this.loadingDataForm.next(false);
                });
                
            }

        });

    }




    reportPdf() {

        // console.log('imprimir ficha de ', this.cuentaBanco);
        // console.log('imprimir ficha de ', this.persona);
        
        this.loadingDataForm.next(true);
        this.personaReportService.ficha(this.cuentaBanco.persona|| this.persona.id).subscribe(data => {
            this.loadingDataForm.next(false);
            // console.log('response:', data);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }

    // searchMoneda(){

    //     if(!this.f.moneda.value || this.f.moneda.value.length==0 || !this.moneda.value){
    //       return '';
    //     }
    //     return this.moneda.value.filter(m=>m.id===this.f.moneda.value)[0]?.moneda || '';
    // }

    // creaCuenta(){

    //     this.cuentaBanco.numeroCuenta = this.constants.BANCO + this.constants.AGENCIA + '84'+this.cuentaBanco.tipoProducto ;
    // }


    openInterviniente(opened: boolean) {

        console.log('send data al Interviniente');

        this.showIntervinientes = opened;
        this.cdr.detectChanges();
    }

    openAfliacionP2p(opened: boolean) {

        console.log('send data afiliaciones');

        this.showAfiliacionP2p = opened;
        this.cdr.detectChanges();
    }

    openTarjetas(opened: boolean) {

        console.log('send data tarjetas');

        this.showAsociarTarjeta = opened;
        this.cdr.detectChanges();
    }

   

}
