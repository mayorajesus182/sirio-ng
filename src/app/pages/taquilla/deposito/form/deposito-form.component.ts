import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-deposito-form',
    templateUrl: './deposito-form.component.html',
    styleUrls: ['./deposito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {

    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    cuentaOperacion: CuentaBancariaOperacion = {} as  CuentaBancariaOperacion;


    moneda: string = "";
    numCuenta: string = "";
    tipoProducto: string = "";
    // cuentasBancarias : CuentaBancaria = {} as CuentaBancaria;
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
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {


        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);
        this.buildForm(this.deposito);
        this.loadingDataForm.next(false);

        this.tipoDocumentoService.actives().subscribe(data => {
            this.tiposDocumentos.next(data);
        });

        if (this.f.tipoDocumento.value == "") {
            this.f.identificacion.disable();
        }

        this.f.tipoDocumento.valueChanges.subscribe(val => {
            if (val) {
                this.f.identificacion.enable()
            }
        })
        //TODO: Revisar
        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val) {
                this.cuentaOperacion = this.cuentasBancarias.value.filter(e => e.id == val)[0];//obtiendo el unico resultado seleccionado al aplicar el filtro
                // this.numCuenta = this.cuentasBancarias.value.filter(e => e.id == val)[0].numeroCuenta;
                // this.tipoProducto = this.cuentasBancarias.value.filter(e => e.id == val)[0].tipoProducto;
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
                        // console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAaa",cuenta)
                        this.cuentasBancarias.next(cuenta);

                    })
                    this.cdr.markForCheck();
                }, err => {
                    this.f.identificacion.setErrors({ notexists: true });
                    this.persona = {} as Persona;
                    this.cdr.markForCheck();
                })
            }


        });


        this.loading$.subscribe(val=>{
            if(val){
                this.persona= {} as Persona;
                this.cuentaOperacion = {} as CuentaBancariaOperacion;
            }
        });

    }

    buildForm(deposito: Deposito) {
        this.itemForm = this.fb.group({
            // institucion: new FormControl([deposito.institucion || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            // agencia: new FormControl([deposito.agencia || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            // persona: new FormControl(deposito.persona || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            nombre: new FormControl(deposito.nombre || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            numper: new FormControl(deposito.numper || undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl([deposito.cuentaBancaria || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoDocumento: new FormControl(deposito.tipoDocumento || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl(deposito.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            numeroCuenta: new FormControl([deposito.numeroCuenta || '', [ Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            moneda: new FormControl([deposito.moneda || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoProducto: new FormControl([deposito.tipoProducto || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            // referencia: new FormControl(deposito.referencia || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            esEfectivo: new FormControl(false),
            esCheque: new FormControl(false),
            // chequePropio: new FormControl(deposito.chequePropio || undefined, [Validators.required]),
            // cantidadPropio: new FormControl(deposito.cantidadPropio || undefined, [Validators.required]),
            // chequeOtros: new FormControl(deposito.chequeOtros || undefined, [Validators.required]),
            // cantidadOtros: new FormControl(deposito.cantidadOtros || undefined, [Validators.required]),
            monto: new FormControl(deposito.monto || undefined, [Validators.required]),
            // libreta: new FormControl(deposito.libreta || '', [Validators.required]),
            // linea: new FormControl(deposito.linea || '', [Validators.required]),
            // telefono: new FormControl(deposito.telefono || '', [Validators.required]),
            // email: new FormControl([deposito.email || '', [Validators.required]]),
            // estatusOperacion: new FormControl([deposito.estatusOperacion || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
        });

    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);

        // this.deposito.numper = this.persona.numper;
        // this.deposito.nombre = this.persona.nombre;
        this.updateDataFromValues (this.deposito,this.persona);
        this.updateDataFromValues (this.deposito,this.cuentaOperacion);
        if (this.f.esEfectivo.value && !this.f.esCheque.value) {
            this.deposito.efectivo = this.f.monto.value;
        }
        // this.deposito.tipoProducto = this.tipoProducto;
        // this.deposito.numeroCuenta = this.numCuenta;
        // console.log("HOLAAAAAAAAAAAAAAAAAA", this.deposito);
        
        this.saveOrUpdate(this.depositoService, this.deposito, 'El Deposito', this.isNew);
        // this.persona.nomb = "";
        // this.cuentaOperacion.moneda = "";
    }

}