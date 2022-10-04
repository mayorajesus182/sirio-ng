import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
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
    /*public Personas = new BehaviorSubject<Persona[]>([]);
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);*/


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
       private retiroService: RetiroService,
       /*private PersonaGetByTipoDoc: PersonaService,
        private parroquiaService: ParroquiaService,
        private municipioService: MunicipioService,
        private estadoService: EstadoService,*/
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.loadingDataForm.next(true);
      

       /* this.institucionService.get().subscribe((inst: Institucion) => {
            this.institucion = inst;
            this.buildForm(this.institucion);
            this.loadingDataForm.next(false);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });*/
        
      /* trae servicio de estado
        this.estadoService.activesByPais(GlobalConstants.PAIS_LOCAL).subscribe(data => {
            this.estados.next(data);
            this.cdr.detectChanges();
        });
        */
        

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


        this.itemForm = this.fb.group({
           /* id: [institucion.id || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            identificacion: [institucion.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            siglas: [institucion.siglas || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            */
           
            

            monto: new FormControl(retiro.monto || '', [Validators.required, ]),
            identificacion: [retiro.identificacion || undefined, [Validators.required]],
            numeroCuenta: [retiro.numeroCuenta || undefined, [Validators.required]],
           
            referencia: [retiro.referencia || undefined, [Validators.required]],
            telefono: [retiro.telefono || '', [Validators.required, ]],
           /*direccion: [institucion.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            email: [institucion.email || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            web: [institucion.web || ''],
            telefono: [institucion.telefono || '', [Validators.required]],
            telefono_alt: [institucion.telefono_alt || ''],
            latitud: [institucion.latitud || '', [Validators.required]],
            longitud: [institucion.longitud || '', [Validators.required]],*/

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
