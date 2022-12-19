import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import * as moment from 'moment';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { OrigenFondo, OrigenFondoService } from 'src/@sirio/domain/services/configuracion/producto/origen-fondo.service';
import { DestinoCuenta, DestinoCuentaService } from 'src/@sirio/domain/services/configuracion/producto/destino-cuenta.service';
import { MotivoSolicitud, MotivoSolicitudService } from 'src/@sirio/domain/services/configuracion/producto/motivo-solicitud.service';
import { PromedioTransaccion, PromedioTransaccionService } from 'src/@sirio/domain/services/configuracion/producto/promedio-transaccion.service';
import { PromedioMonto, PromedioMontoService } from 'src/@sirio/domain/services/configuracion/producto/promedio-monto.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoSubproducto, TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';

@Component({
    selector: 'app-cuenta-banco-form',
    templateUrl: './cuenta-banco-form.component.html',
    styleUrls: ['./cuenta-banco-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CuentaBancoFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {
    todayValue: moment.Moment;
    totalAddress: number;
    totalRegistroMercantil : number;
    totalInfoLab: number;
    totalPep: number;
    totalApoderado: number;
    totalPhone: number;
    totalBankReference: number;
    totalPersonalReference: number;
    totalContact: number;
    searchForm: FormGroup;
    hasBasicData = false;
    showAddress = false;
    
    btnCreateDisabled = true;
    nombreCompletoPersona = 'FULL NAME';
    
    cuentaBanco: CuentaBanco = {} as CuentaBanco;
    constants = GlobalConstants;
    estado_civil: string;
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    refreshDirecciones = new BehaviorSubject<boolean>(false);
    paises = new BehaviorSubject<Pais[]>([]);
    nacionadades = new BehaviorSubject<Pais[]>([]);
    origenes = new BehaviorSubject<OrigenFondo[]>([]);
    destinos = new BehaviorSubject<DestinoCuenta[]>([]);
    motivos = new BehaviorSubject<MotivoSolicitud[]>([]);
    promedioTransacciones = new BehaviorSubject<PromedioTransaccion[]>([]);
    promedioMontos = new BehaviorSubject<PromedioMonto[]>([]);

    tipoProducto = new BehaviorSubject<TipoProducto[]>([]);
        
    tipoSubproductos = new BehaviorSubject<TipoSubproducto[]>([]);

    moneda = new BehaviorSubject<Moneda[]>([]);

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private cuentaBancoService: CuentaBancoService,
        private tipoDocumentoService: TipoDocumentoService,
        private origenFondoService: OrigenFondoService,
        private destinoCuentaService: DestinoCuentaService,
        private motivoSolicitudService: MotivoSolicitudService,
        private promedioTransaccionService: PromedioTransaccionService,
        private promedioMontoService: PromedioMontoService,
        private paisService: PaisService,
        private tipoSubproductoService: TipoSubproductoService,
        private tipoProductoService: TipoProductoService,       

        private monedaService: MonedaService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    get search() {
        return this.searchForm ? this.searchForm.controls : {};
    }

    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                // if (this.f.actividadEconomica && this.f.actividadEconomica.value) {
                    // this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                    //     this.actividadesEspecificas.next(data);
                    //     // this.cdr.detectChanges();
                    // });
                // }
                this.hasBasicData = this.cuentaBanco.id != undefined || this.cuentaBanco.numeroCuenta != undefined;
            }
        });
    }

    ngOnInit() {
        this.loadingDataForm.next(false);

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
        
        this.monedaService.actives().subscribe(data => {
            this.moneda.next(data);
        });

        this.tipoSubproductoService.actives().subscribe(data => {
            this.tipoSubproductos.next(data);
        });

        this.tipoProductoService.actives().subscribe(data => {
            this.tipoProducto.next(data);
        });

        this.cdr.detectChanges();        
    }
    
    buildForm(cuentaBanco: CuentaBanco) { 

        this.itemForm = this.fb.group({
            numeroCuenta: new FormControl(cuentaBanco.numeroCuenta || undefined, [Validators.required]),           
            moneda: new FormControl(cuentaBanco.moneda || undefined, [Validators.required]),
            tipoProducto: new FormControl(cuentaBanco.tipoSubproducto || undefined, [Validators.required]),
            tipoSubproducto: new FormControl(cuentaBanco.tipoSubproducto || undefined, [Validators.required]),
            origenFondo: new FormControl(cuentaBanco.origenFondo || undefined, [Validators.required]),
            destinoCuenta: new FormControl(cuentaBanco.destinoCuenta || undefined, [Validators.required]),
            motivoSolicitud: new FormControl(cuentaBanco.motivoSolicitud || undefined, [Validators.required]),
            transaccionesCredito: new FormControl(cuentaBanco.transaccionesCredito || undefined, [Validators.required]),
            montoCredito: new FormControl(cuentaBanco.montoCredito || undefined, [Validators.required]),
            transaccionesDebito: new FormControl(cuentaBanco.transaccionesDebito || undefined, [Validators.required]),
            montoDebito: new FormControl(cuentaBanco.montoDebito || undefined, [Validators.required]),            
            transaccionesElectronico: new FormControl(cuentaBanco.transaccionesElectronico || undefined, [Validators.required]),
            montoElectronico: new FormControl(cuentaBanco.montoElectronico || undefined, [Validators.required]),
            fondoExterior: new FormControl(cuentaBanco.fondoExterior || false),
            paisOrigen: new FormControl(cuentaBanco.paisOrigen || undefined),
            paisDestino: new FormControl(cuentaBanco.paisDestino || undefined),
        });

        // verifico si tengo datos basicos cargados
        // this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

        this.tipoDocumentoService.activesByTipoPersona(this.constants.CUENTA_BANCO).subscribe(data => {
            this.tipoDocumentos.next(data);
            const tipo = data.filter(t => t.id == this.f.tipoDocumento.value)[0];
            this.f.tipoDocumento.setValue( tipo.nombre);
        });
    }

    addCuenta(event) {
        //console.log('create ', event);
        //console.log('add new person');
        this.isNew = true;
        this.updateDataFromValues(this.cuentaBanco, event);
        this.buildForm(this.cuentaBanco);
        this.loaded$.next(true);
        // if(this.itemForm){
        //     this.f.tipoDocumento.setValue(this.cuentaBanco.tipoDocumento);
        //     this.f.identificacion.setValue(this.cuentaBanco.identificacion);
        // }
    }

    updateCuenta(event) {
        //console.log('update ', event);
        if (!event.id) {
            return;
        }
        this.loaded$.next(false);

        this.loadingDataForm.next(true);
        this.isNew = false;
        //console.log('current loaded ', this.loaded$.value);

        this.loaded$.next(false);
        this.loadingDataForm.next(true);
        this.cuentaBancoService.get(Number.parseInt(event.id)).subscribe(val => {
            this.cuentaBanco = val;
            //console.log('PERSONAAAA: ', val);
            //TODO: OJO REVISAR ESTO LUEGO
            // this.itemForm.reset({});
            this.buildForm(this.cuentaBanco);
            this.loadingDataForm.next(false);
            this.loaded$.next(true);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });
        // this.router.navigate([`/sirio/persona/natural/${event.id}/edit`]);
    }

    queryResult(event) {
        console.log('event result ', event);

        if (!event.id && !event.numper) {
            this.loaded$.next(false);
            this.cuentaBanco = {} as CuentaBanco;
            this.isNew = true;
            this.cdr.detectChanges();
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cuentaBanco);

        console.log(this.cuentaBanco);

       
        if (this.isNew) {

            this.cuentaBancoService.save(this.cuentaBanco).subscribe(data => {
                console.log(data);

                this.cuentaBanco = data;
                this.successResponse('La Cuenta Banco', 'creada',true);
                this.hasBasicData = this.cuentaBanco.id != undefined || this.cuentaBanco.numeroCuenta != undefined;

            }, error => this.errorResponse(true));

        } else {
            this.cuentaBancoService.update(this.cuentaBanco).subscribe(data => {

                this.successResponse('La persona', 'actualizada',true);
            }, error => this.errorResponse(false));
        }

    }

    send() {

        console.log('send data al banco');
    }

    // moneda(){

    //     if(!this.f.moneda.value || this.f.moneda.value.length==0 || !this.moneda.value){
    //       return '';
    //     }
    //     return this.moneda.value.filter(m=>m.id===this.f.moneda.value)[0]?.moneda || '';
    // }


}
