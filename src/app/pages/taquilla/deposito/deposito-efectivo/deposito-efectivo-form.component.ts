import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { MotivoDevolucionService } from 'src/@sirio/domain/services/configuracion/taquilla/motivo-devolucion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'sirio-deposito-efectivo',
    templateUrl: './deposito-efectivo-form.component.html',
    styleUrls: ['./deposito-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoEfectivoFormComponent extends FormBaseComponent implements OnInit {

    isNew: boolean = false;
    // capturar la busqueda de cuenta y persona
    @Input() cuenta: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    @Input() persona: Persona = {} as Persona;
    

    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    // public tiposDocumentoNaturales = new BehaviorSubject<TipoDocumento[]>([]);
    // cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    deposito: Deposito = {} as Deposito;
    // persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    numCuenta: string = "";
    tipoProducto: string = "";
    detalleEfectivo: number = 0;
    editing: any[] = [];
    loading = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private depositoService: DepositoService,
        private tipoDocumentoService: TipoDocumentoService,
        private cuentaBancariaService: CuentaBancariaService,
        private personaService: PersonaService,
        private calendarioService: CalendarioService,
        private taquillaService: TaquillaService,
        private sessionService: SessionService,
        private motivoDevolucionService: MotivoDevolucionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        // this.f.monto.valueChanges.subscribe(val => {
        //     if (val) {
        //         this.calculateDifferences();
        //     }
        // })
        

        this.itemForm = this.fb.group({
            moneda: new FormControl('', []),
            efectivo: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            monto: new FormControl(undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
        });

        this.f.efectivo.valueChanges.subscribe(val => {
            if (val) {
                this.calculateDifferences();
            }
        });
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();

    }


    calculateDifferences(event?: any) {

        let valorEfectivo = this.f.efectivo.value ? this.f.efectivo.value : 0;
        let monto = this.f.monto.value;
        if (valorEfectivo != (event ? (event.montoTotal > 0 ? event.montoTotal : monto) : monto)) {

            this.f.monto.setErrors({
                totalDifference: true
            });

            this.f.monto.markAsDirty();
            this.f.efectivo.setErrors({
                difference: true
            });

            this.validarMonto(event);
        } else {

            this.validarMonto(event);

            this.f.monto.setErrors(undefined);
            this.f.efectivo.setErrors(undefined);
        }
    }

    validarMonto(event) {
        if (event && (event.montoTotal > 0)) {
            this.f.monto.setValue(event.montoTotal);
        }
    }

    // this.fForm = this.fb.group({

    // nombre: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
    // numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
    // cuentaBancaria: new FormControl(undefined, []),
    // tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
    // identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
    // numeroCuenta: new FormControl(undefined),
    // moneda: new FormControl('', []),
    // efectivo: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
    // monto: new FormControl(undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
    // tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
    // referencia: new FormControl('', Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)),
    // esEfectivo: new FormControl(true),
    // esCheque: new FormControl(false),
    // // esChequeMixto: new FormControl(false),
    // tipoDocumentoDepositante: new FormControl('', Validators.required),
    // identificacionDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
    // nombreDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
    // telefono: new FormControl(''),
    // email: new FormControl(''),
    // cantidadPropio: new FormControl(deposito. undefined, [Validators.required]),
    // cantidadOtros: new FormControl(deposito undefined, [Validators.required]),
    // conLibreta: new FormControl(false),
    // conMovimiento: new FormControl(false),
    // libreta: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
    // linea: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
    // chequeOtros: new FormControl(undefined),
    // chequePropio: new FormControl(undefined),

    // });

    // this.f.esEfectivo.valueChanges.subscribe(val => {
    //     if (!val) {
    //         this.f.efectivo.setValue(undefined);
    //         this.f.efectivo.setErrors(undefined);
    //         this.conoActual = [];
    //         this.conoAnterior = [];
    //         this.f.monto.setValue(undefined);
    //         this.f.referencia.setValue('');
    //     }
    // })

    // this.f.conLibreta.valueChanges.subscribe(val => {
    //     if (!val) {
    //         this.f.libreta.setValue(undefined);
    //         this.f.libreta.setErrors(undefined);
    //         this.f.linea.setValue(undefined);
    //         this.f.linea.setErrors(undefined);
    //         this.cdr.detectChanges();
    //     }

    // })

    // this.f.cuentaBancaria.valueChanges.subscribe(val => {
    //     if (val && (val != '')) {
    //         let cuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0];
    //         this.moneda.id = cuenta.moneda;
    //         this.moneda.nombre = cuenta.monedaNombre;
    //         this.moneda.siglas = cuenta.siglas;
    //         this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
    //         this.f.moneda.setValue(this.moneda.id);
    //         this.f.tipoProducto.setValue(cuenta.tipoProducto);
    //         this.f.esEfectivo.enable()
    //         this.f.esCheque.enable()
    //         this.f.esEfectivo.setValue(true);
    //         this.f.esCheque.setValue(false);
    //         this.cdr.detectChanges();
    //     }
    // })


    updateCashDetail(event) {
        if (!event) {
            return;
        }

        this.calculateDifferences(event)
        this.conoActual = event.desgloseConoActual;
        this.conoAnterior = event.desgloseConoAnterior;
        this.cdr.detectChanges();
    }

}



