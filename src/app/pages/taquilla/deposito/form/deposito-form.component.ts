import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-deposito-form',
    templateUrl: './deposito-form.component.html',
    styleUrls: ['./deposito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {

    deposito: Deposito = {} as Deposito;
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    // public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    // public personaSimple = new BehaviorSubject<Persona[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private depositoService: DepositoService,
        private tipoDocumentoService: TipoDocumentoService,
        // private cuentaBancariaService: CuentaBancariaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        // if (id) {
        //     this.depositoService.get(id).subscribe((agn: Deposito) => {
        //         this.deposito = agn;
        //         this.buildForm(this.deposito);
        //         this.cdr.markForCheck();
        //         this.loadingDataForm.next(false);
        //         this.applyFieldsDirty();
        //         this.cdr.detectChanges();
        //     });
        // } else {
            this.buildForm(this.deposito);
            this.loadingDataForm.next(false);
        // }

        // if(!id){
        //     this.f.id.valueChanges.subscribe(value => {
        //         if (!this.f.id.errors && this.f.id.value.length > 0) {
        //             this.codigoExists(value);
        //         }
        //     });
        // }

        this.tipoDocumentoService.actives().subscribe(data => {
            this.tiposDocumentos.next(data);
        });
        
    }

    // ngAfterViewInit(): void {
    //     this.loading$.subscribe(loading => {
    //         if (!loading) {
    //             if (this.f.pais.value) {
    //                 this.estadoService.activesByPais(this.f.pais.value).subscribe(data => {
    //                     this.estados.next(data);
    //                     this.cdr.detectChanges();
    //                 });
    //             }

    //             if (this.f.estado.value) {
    //                 this.depositoService.activesByEstado(this.f.estado.value).subscribe(data => {
    //                     this.depositos.next(data);
    //                     this.cdr.detectChanges();
    //                 });
    //             }

    //         }
    //     });

    // }

    buildForm(deposito: Deposito) {
        this.itemForm = this.fb.group({
            institucion: new FormControl([deposito.institucion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            agencia: new FormControl([deposito.agencia || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            persona: new FormControl(deposito.persona || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            numper: new FormControl(deposito.numper || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl([deposito.cuentaBancaria || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoDocumento: new FormControl(deposito.tipoDocumento || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion:  new FormControl(deposito.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            nombre: new FormControl(deposito.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            numeroCuenta:  new FormControl([deposito.numeroCuenta || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            moneda:  new FormControl([deposito.moneda || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoProducto:  new FormControl([deposito.tipoProducto || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
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

        // this.f.pais.valueChanges.subscribe(value => {
        //     this.estadoService.activesByPais(this.f.pais.value).subscribe(data => {
        //         this.estados.next(data);

        //         this.cdr.detectChanges();
        //     });
        // });


        // this.f.estado.valueChanges.subscribe(value => {
        //         this.depositoService.activesByEstado(this.f.estado.value).subscribe(data => {
        //         this.depositos.next(data);
        //         this.cdr.detectChanges();
        //     });
        // });

        // this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);
        this.saveOrUpdate(this.depositoService, this.deposito, 'El Deposito', this.isNew);
    }

    // private codigoExists(id) {
    //     this.depositoService.exists(id).subscribe(data => {
    //         if (data.exists) {
    //             this.itemForm.controls['id'].setErrors({
    //                 exists: true
    //             });
    //             this.cdr.detectChanges();
    //         }
    //     });
    // }


}