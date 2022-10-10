import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
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
    cuentaBancaria: CuentaBancaria = {} as CuentaBancaria; // un solo registro
    persona: Persona = {} as Persona;
    agencia: Agencia = {} as Agencia;
    moneda: Moneda = {} as Moneda;
    tipoProducto: TipoProducto = {} as TipoProducto;
    
   // formData2: FormGroup;
    itemForm: FormGroup;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,
        private personaService: PersonaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

   /* get form2() {
        return !this.formData2 ? {} : this.formData2.controls;
    }*/

    get form2() {
        return !this.itemForm ? {} : this.itemForm.controls;
    }

    

    refreshForm2() {

        console.log('form2 tipoDocumento ',this.form2.tipoDocumento.value);  
        


             
        
        
        // manejo de escritura en el campo NUMERO DE CUENTA
         this.form2.numeroCuenta.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        ).subscribe(() => {
            // se busca los dato que el usuario suministro      
            const numeroCuenta = this.form2.numeroCuenta.value;
            console.log("numeroCuentaDatos: ", numeroCuenta);         

            if (numeroCuenta) {
                this.cuentaBancariaService.activesByNumeroCuenta(numeroCuenta).subscribe(data => {                   
                    this.cuentaBancaria = data;            
                    console.log("DATOS", data);                   
                    this.cdr.markForCheck();

                }, err => {
                    console.log(err);
                    this.form2.cuentaBancaria.setErrors({ notexists: true });
                    this.cuentaBancaria = {} as CuentaBancaria;
                    this.cdr.markForCheck();
                })
            }
        });



    }

    ngOnInit() {


        this.buildForm(this.retiro);
        this.loadingDataForm.next(false);


        //trae servicio de TIPO DE DOCUMENTOS   
        this.tipoDocumentoService.actives().subscribe(data => {
            this.tipoDocumentos.next(data);
        });



    }
    ngAfterViewInit(): void {

        this.form2.mostrar.valueChanges.subscribe(data => {
            this.refreshForm2();
            this.cdr.detectChanges();
        })

    }

    buildForm(retiro: Retiro) {

          

        this.itemForm = this.fb.group({         

            mostrar: [false],
            
            persona: new FormControl(retiro.persona || '', [Validators.required, ]),
            numper: new FormControl(retiro.numper || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            cuentaBancaria: new FormControl([retiro.cuentaBancaria || '', [Validators.required, ]]),
            tipoDocumento: new FormControl(retiro.tipoDocumento || undefined, [Validators.required]),
            identificacion: new FormControl(this.retiro.identificacion || undefined, [Validators.required]),
            nombre: new FormControl(retiro.nombre || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            monto: new FormControl(retiro.monto || undefined, [Validators.required]),
            numeroCuenta: new FormControl(retiro.numeroCuenta || '', [Validators.required]),
            moneda: new FormControl([retiro.moneda || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            tipoProducto: new FormControl([retiro.tipoProducto || '', [Validators.required,]]),
            estatusOperacion: new FormControl([retiro.estatusOperacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]]),
            referencia: new FormControl(retiro.referencia || '', [Validators.required]),
            
           
        });
        console.log('retiroooooooooo ', retiro);
        //this.printErrors()

    }


    save() {
        if (this.itemForm.invalid)
            return;


        this.updateData(this.retiro);
        this.retiro.numper = this.persona.numper;       
        this.retiro.estatusOperacion = this.tipoProducto.id;
        this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque', this.isNew);



    }

}
