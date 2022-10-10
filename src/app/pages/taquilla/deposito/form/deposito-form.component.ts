import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Agencia } from 'src/@sirio/domain/services/organizacion/agencia.service';
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
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProducto: TipoProducto = {} as TipoProducto;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private depositoService: DepositoService,
        private tipoDocumentoService: TipoDocumentoService,
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

        this.f.tipoDocumento.valueChanges.subscribe(val=>{
            if(val){
                this.f.identificacion.enable()
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
                    //console.log("hOLAAAAAAAAAAA" , data);
                    this.persona = data;
                    this.cdr.markForCheck();

                }, err => {
                    //console.log(err);
                    this.f.identificacion.setErrors({ notexists: true });
                    this.persona = {} as Persona;
                    this.cdr.markForCheck();
                })
            }
        });

    }

    buildForm(deposito: Deposito) {
        this.itemForm = this.fb.group({
            institucion: new FormControl([deposito.institucion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            agencia: new FormControl([deposito.agencia || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            persona: new FormControl(deposito.persona || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            numper: new FormControl(deposito.numper || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl([deposito.cuentaBancaria || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoDocumento: new FormControl(deposito.tipoDocumento || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl(deposito.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            numeroCuenta: new FormControl([deposito.numeroCuenta || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            moneda: new FormControl([deposito.moneda || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoProducto: new FormControl([deposito.tipoProducto || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            referencia: new FormControl(deposito.referencia || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            efectivo: new FormControl(deposito.efectivo || '', [Validators.required]),
            chequePropio: new FormControl(deposito.chequePropio || undefined, [Validators.required]),
            cantidadPropio: new FormControl(deposito.cantidadPropio || undefined, [Validators.required]),
            chequeOtros: new FormControl(deposito.chequeOtros || undefined, [Validators.required]),
            cantidadOtros: new FormControl(deposito.cantidadOtros || undefined, [Validators.required]),
            monto: new FormControl(deposito.monto || undefined, [Validators.required]),
            libreta: new FormControl(deposito.libreta || '', [Validators.required]),
            linea: new FormControl(deposito.linea || '', [Validators.required]),
            telefono: new FormControl(deposito.telefono || '', [Validators.required]),
            email: new FormControl([deposito.email || '', [Validators.required]]),
            estatusOperacion: new FormControl([deposito.estatusOperacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),

        });

    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);
        this.deposito.numper = this.persona.numper;
        this.deposito.institucion = this.agencia.institucion;
        this.deposito.agencia = this.agencia.id;
        this.deposito.moneda = this.moneda.id;
        this.deposito.tipoProducto = this.tipoProducto.id;
       
        this.saveOrUpdate(this.depositoService, this.deposito, 'El Deposito', this.isNew);
    }

}