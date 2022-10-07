import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
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
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    cuentaBancarias = new BehaviorSubject<CuentaBancaria[]>([]);

    //formData: FormGroup;
    formData2: FormGroup;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private tipoDocumentoService: TipoDocumentoService,     
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }
   
    get form2() {
        return !this.formData2 ? {} : this.formData2.controls;
      }

    ngOnInit() {

       
        this.buildForm(this.retiro);
        this.loadingDataForm.next(false);
      

       /* this.institucionService.get().subscribe((inst: Institucion) => {
            this.institucion = inst;
            this.buildForm(this.institucion);
            this.loadingDataForm.next(false);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });*/
        
       //trae servicio de TIPO DE DOCUMENTOS
        this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
            this.tipoDocumentos.next(data);
            this.cdr.detectChanges();
        });

       /* this.cuentaBancariaService.activesByNumeroCuenta(GlobalConstants.C).subscribe(data => {
            this.tipoDocumentos.next(data);
            this.cdr.detectChanges();
        });*/

        this.cuentaBancariaService.activesByNumeroCuenta(this.f.numeroCuenta.value).subscribe(data => {
            this.cuentaBancarias.next(data);
            this.cdr.detectChanges();
        });

       
       this.formData2 = this.fb.group({
            mostrar: [false],   
            monto: new FormControl(this.retiro.monto), 
            tipoDocumento: new FormControl(this.retiro.tipoDocumento || undefined, [Validators.required]),  
            cuenta: new FormControl('', Validators.required),
            referencia: new FormControl('', Validators.required),
            cuentaBancaria: new FormControl(this.retiro.numeroCuenta || undefined, [Validators.required]),  

          })
        

    }
    ngAfterViewInit(): void {
       /* this.loading$.subscribe(loading => {
            if (!loading) {
                if (this.f.estado.value) {
                    this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                        this.municipios.next(data);
                        this.cdr.detectChanges();
                    });
                }

                if (this.f.municipio.value) {
                    this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
                        this.parroquias.next(data);
                        this.cdr.detectChanges();
                    });
                }

                if (this.f.parroquia.value) {                    
                    this.zonaPostalService.activesByParroquia(this.f.parroquia.value).subscribe(data => {   
                        this.zonasPostales.next(data);
                        this.cdr.detectChanges();
                    });
                }
            }
        });*/

    }

    buildForm(retiro: Retiro) {

        this.formData2 = this.fb.group({
            mostrar: [false],          
            monto: new FormControl(retiro.monto),
            tipoDocumento: new FormControl(retiro.tipoDocumento || undefined, [Validators.required]),
            cuenta: new FormControl(retiro.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            referencia: new FormControl(retiro.referencia || '', [Validators.required, ]),
            cuentaBancaria: new FormControl(retiro.numeroCuenta || undefined, [Validators.required]),
          });
        
        
      /*  this.itemForm = this.fb.group({
            tipoDocumento: new FormControl(retiro.tipoDocumento || undefined, [Validators.required]),
            identificacion: new FormControl(retiro.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
           
            

            monto: new FormControl(retiro.monto || '', [Validators.required, ]),
           
           // numeroCuenta: [retiro.numeroCuenta || undefined, [Validators.required]],
           
            referencia: [retiro.referencia || undefined, [Validators.required]],
            telefono: [retiro.telefono || '', [Validators.required, ]],
          

        });*/

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
