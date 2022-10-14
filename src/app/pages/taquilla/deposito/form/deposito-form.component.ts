import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, throwIfEmpty } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import * as moment from 'moment';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
@Component({
    selector: 'app-deposito-form',
    templateUrl: './deposito-form.component.html',
    styleUrls: ['./deposito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {

    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    todayValue: moment.Moment;

    moneda: Moneda = {} as Moneda;
    numCuenta: string = "";
    tipoProducto: string = "";
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private depositoService: DepositoService,
        private tipoDocumentoService: TipoDocumentoService,
        private cuentaBancariaService: CuentaBancariaService,
        private personaService: PersonaService,
        private calendarioService: CalendarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.isNew = true;
        this.loadingDataForm.next(true);
        this.buildForm();
        this.loadingDataForm.next(false);
        this.applyFieldsDirty();

        this.tipoDocumentoService.actives().subscribe(data => {
            this.tiposDocumentos.next(data);
        });

        if (this.f.tipoDocumento.value == "") {
            this.f.identificacion.disable();
            this.f.esEfectivo.disable();
            this.f.esCheque.disable();
        }

        this.f.tipoDocumento.valueChanges.subscribe(val => {
            if (val) {
                this.f.identificacion.enable()

            }
        })
        //TODO: Revisar
        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val) {
                //obtiendo el unico resultado seleccionado al aplicar el filtro
                this.cuentaOperacion = this.cuentasBancarias.value.filter(e => e.id == val)[0];
                this.f.esEfectivo.enable()
                this.f.esCheque.enable()
                this.moneda.id = this.cuentaOperacion.moneda;
                this.moneda.nombre = this.cuentaOperacion.monedaNombre;
            }

        })

        // manejo de escritura en el campo identificacion
        this.f.identificacion.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        ).subscribe(() => {
            // se busca los dato que el usuario suministro      
            const tipoDocumento = this.f.tipoDocumento.value;
            const identificacion = this.f.identificacion.value;
            if (tipoDocumento && identificacion) {
                this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                    this.persona = data;
                    const numper = data.numper;
                    this.cuentaBancariaService.activesByNumper(numper).subscribe(cuenta => {
                        this.cuentasBancarias.next(cuenta);
                    });

                    this.cdr.markForCheck();
                }, err => {
                    this.f.identificacion.setErrors({ notexists: true });
                    this.persona = {} as Persona;
                    this.cuentasBancarias.next([]);
                    this.cuentaOperacion = {} as CuentaBancariaOperacion;
                    this.itemForm.controls.cuentaBancaria.setValue(undefined);
                    this.cdr.detectChanges();
                })
            }
        });

        this.loading$.subscribe(val => {
            if (val) {
                this.persona = {} as Persona;
                this.cuentaOperacion = {} as CuentaBancariaOperacion;
                this.cuentasBancarias.next([]);
                this.f.esEfectivo.disable();
                this.f.esCheque.disable();

            }
        });

        this.calendarioService.today().subscribe(data => {
            this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
            this.cdr.detectChanges();
        });

    }

    buildForm() {
        this.itemForm = this.fb.group({

            nombre: new FormControl( '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            numper: new FormControl( undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl( undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl( '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numeroCuenta: new FormControl(undefined),
            moneda: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            efectivo: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            referencia: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            esEfectivo: new FormControl(false),
            esCheque: new FormControl(false),
            monto: new FormControl( undefined, Validators.required),
            telefono: new FormControl(''),
            email: new FormControl( ''),   
            // cantidadPropio: new FormControl(deposito. undefined, [Validators.required]),
            // cantidadOtros: new FormControl(deposito undefined, [Validators.required]),
            // libreta: new FormControl(de '', [Validators.required]),
            // linea: new FormControl( '', [Validators.required]),
            
            chequeOtros: new FormControl(undefined),
            chequePropio: new FormControl(undefined),
            numeroCuentaCheque: new FormControl(''),
            montoCheque: new FormControl(undefined),
            serial: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            fechaEmision: new FormControl(''),
            tipoDocumentoCheque: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            codigoSeguridad: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);
        this.updateDataFromValues(this.deposito, this.persona);
        this.updateDataFromValues(this.deposito, this.cuentaOperacion);
        this.saveOrUpdate(this.depositoService, this.deposito, 'El Deposito');
    }

    updateCashDetail(event) {
        console.log('update cash detail ',event)
        if(!event){
          return;
        }
        this.conoActual=event.desgloseConoActual;
        this.conoAnterior=event.desgloseConoAnterior;
        this.cdr.detectChanges();
      }
}