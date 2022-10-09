import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
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
    cuentaBancaria = new BehaviorSubject<CuentaBancaria[]>([]);
   // cuentaBancaria: CuentaBancaria = {} as CuentaBancaria;
 
    persona: Persona = {} as Persona;

    //formData: FormGroup;
    formData2: FormGroup;

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

    get form2() {
        return !this.formData2 ? {} : this.formData2.controls;
    }

    refreshForm2() {

        console.log('form2 tipoDocumento ',this.form2.tipoDocumento.value);
        

        if (!this.form2.tipoDocumento.value || this.form2.tipoDocumento.value == "") {
            this.form2.identificacion.disable();

        }
        this.form2.tipoDocumento.valueChanges.subscribe(val => {
            if (val) {
                this.form2.identificacion.enable()
            }
        })
        // manejo de escritura en el campo identificacion
        this.form2.identificacion.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        ).subscribe(() => {
            // se busca los dato que el usuario suministro      
            const tipoDocumento = this.form2.tipoDocumento.value;
            const identificacion = this.form2.identificacion.value;

            if (tipoDocumento && identificacion) {
                this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                    console.log("hOLAAAAAAAAAAA", data);
                    this.persona = data;
                    this.cdr.markForCheck();

                }, err => {
                    //console.log(err);
                    this.form2.identificacion.setErrors({ notexists: true });
                    this.persona = {} as Persona;
                    this.cdr.markForCheck();
                })
            }
        });
         // manejo de escritura en el campo NUMERO DE CUENTA
         this.form2.numeroCuenta.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        ).subscribe(() => {
            // se busca los dato que el usuario suministro      
            const numeroCuenta = this.form2.numeroCuenta.value;
            console.log("numeroCuentaDatos: ", numeroCuenta);
           // const identificacion = this.form2.identificacion.value;

            if (numeroCuenta) {
                this.cuentaBancariaService.activesByNumeroCuenta(numeroCuenta).subscribe(data => {
                   console.log("numeroCuenta", data);
                    //this.cuentaBancaria = data;
                   this.cuentaBancaria.next(data);
                    this.cdr.markForCheck();

                }, err => {
                    //console.log(err);
                    this.form2.cuentaBancaria.setErrors({ notexists: true });
                    //this.cuentaBancaria = {} as CuentaBancaria;
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

       /* this.cuentaBancariaService.activesByNumeroCuenta(this.f.numeroCuenta.value).subscribe(data => {
            this.cuentaBancarias.next(data);
            this.cdr.detectChanges();
        });*/


        /*this.formData2 = this.fb.group({        
             mostrar: [false],              
             monto: new FormControl(this.retiro.monto), 
             tipoDocumento: new FormControl(this.retiro.tipoDocumento || undefined, [Validators.required]),  
             cuenta: new FormControl('', Validators.required),
             referencia: new FormControl('', Validators.required),
             cuentaBancaria: new FormControl(this.retiro.numeroCuenta || undefined, [Validators.required]),  
             persona: new FormControl(this.retiro.persona || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
     
            // identificacion: new FormControl(this.retiro.identificacion || undefined, [Validators.required]), 
         
           })*/


    }
    ngAfterViewInit(): void {

        this.form2.mostrar.valueChanges.subscribe(data => {
            this.refreshForm2();
            this.cdr.detectChanges();
        })

    }

    buildForm(retiro: Retiro) {

        this.formData2 = this.fb.group({
            mostrar: [false],
            monto: new FormControl(retiro.monto),
            tipoDocumento: new FormControl(retiro.tipoDocumento || undefined, [Validators.required]),
            cuenta: new FormControl(retiro.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            referencia: new FormControl(retiro.referencia || '', [Validators.required,]),
            numeroCuenta: new FormControl(retiro.numeroCuenta || '', [Validators.required]),
            moneda: new FormControl('', Validators.required),
            identificacion: new FormControl(this.retiro.identificacion || undefined, [Validators.required]),
            persona: new FormControl(retiro.persona || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            nombre: new FormControl(retiro.nombre ||  '', Validators.required),
        });



        /* this.f.estado.valueChanges.subscribe(value => {
             this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                 this.municipios.next(data);
                 this.cdr.detectChanges();
             });
         });
 
         this.f.municipio.valueChanges.subscribe(value => {           
             this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
                 this.parroquias.next(data);
                 this.cdr.detectChanges();
             });
         });
 
         this.f.parroquia.valueChanges.subscribe(value => {           
             this.zonaPostalService.activesByParroquia(this.f.parroquia.value).subscribe(data => {
                 this.zonasPostales.next(data);
                 this.cdr.detectChanges();
             });
         });
 
         this.cdr.detectChanges();
         this.printErrors()*/
    }


    save() {
        if (this.itemForm.invalid)
            return;


        this.updateData(this.retiro);
        this.saveOrUpdate(this.retiroService, this.retiro, 'el pago del cheque', this.isNew);



    }

}
