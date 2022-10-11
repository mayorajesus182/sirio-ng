import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';

import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Agencia } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { Retiro, RetiroService } from 'src/@sirio/domain/services/taquilla/retiro.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

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
    cuentaBancariaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion; // un solo registro
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProductos: TipoProducto = {} as TipoProducto;
    esPagoCheque: boolean = false;
    
    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,
        private personaService: PersonaService,
        private tipoProductoService: TipoProductoService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

 

    ngOnInit() {
        this.buildForm(this.retiro);
        this.loadingDataForm.next(false);
        //trae servicio de TIPO DE DOCUMENTOS   
        this.tipoDocumentoService.actives().subscribe(data => {
            this.tipoDocumentos.next(data);
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
                    const tipoProducto = data.tipoProductoNombre;
                    console.log("DATOS", data);                   
                    this.cdr.markForCheck();

                }, err => {
                    console.log(err);
                    this.f.cuentaBancariaOperacion.setErrors({ notexists: true });
                    this.cuentaBancariaOperacion = {} as CuentaBancariaOperacion;
                    this.cdr.markForCheck();
                })
            }
        });



    }

    buildForm(retiro: Retiro) {    
      
        this.itemForm = this.fb.group({ 

            esPagoCheque: new FormControl(false),        
            //persona: new FormControl(retiro.persona || '', [Validators.required, ]),
            
            numper: new FormControl(retiro.numper || undefined),
            //cuentaBancaria: new FormControl([retiro.cuentaBancaria || '', [Validators.required, ]]),
            tipoDocumento: new FormControl(retiro.tipoDocumento || '', [Validators.required]),
            identificacion: new FormControl(this.retiro.identificacion || '', [Validators.required]),
            //nombre: new FormControl(retiro.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            monto: new FormControl(retiro.monto || '', [Validators.required]),
            numeroCuenta: new FormControl(retiro.numeroCuenta || '', [Validators.required]),
            moneda: new FormControl([retiro.moneda || '']),
            tipoProducto: new FormControl([retiro.tipoProducto || '', [Validators.required,]]),
           // estatusOperacion: new FormControl([retiro.estatusOperacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            // referencia: new FormControl(retiro.referencia || '',
            
        });    
       

    }




    save() {
       
        
        if (this.itemForm.invalid)
            return;
           
            

        this.updateData(this.retiro);
        this.updateDataFromValues (this.retiro,this.persona);
        this.updateDataFromValues (this.retiro,this.cuentaBancariaOperacion);
       
       console.log("DATOSS3", this.retiro);
       
       this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque', this.isNew);

       

    }
}
