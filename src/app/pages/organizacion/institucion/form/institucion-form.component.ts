import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
import { Institucion, InstitucionService } from 'src/@sirio/domain/services/organizacion/institucion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-institucion-form',
    templateUrl: './institucion-form.component.html',
    styleUrls: ['./institucion-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class InstitucionFormComponent extends FormBaseComponent implements OnInit {

    institucion: Institucion = {} as Institucion;
    public zonasPostales = new BehaviorSubject<ZonaPostal[]>([]);
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private institucionService: InstitucionService,
        private zonaPostalService: ZonaPostalService,
        private parroquiaService: ParroquiaService,
        private municipioService: MunicipioService,
        private estadoService: EstadoService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.loadingDataForm.next(true);
      

        this.institucionService.get().subscribe((inst: Institucion) => {
            this.institucion = inst;
            this.buildForm(this.institucion);
            this.loadingDataForm.next(false);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });
        
        this.estadoService.activesByPais(GlobalConstants.PAIS_LOCAL).subscribe(data => {
            this.estados.next(data);
            this.cdr.detectChanges();
        });


    }
    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
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
        });

    }

    buildForm(institucion: Institucion) {


        this.itemForm = this.fb.group({
            id: [institucion.id || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            identificacion: [institucion.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            siglas: [institucion.siglas || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            nombre: [institucion.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            parroquia: [institucion.parroquia || undefined, [Validators.required]],
            municipio: [institucion.municipio || undefined, [Validators.required]],
            estado: [institucion.estado || undefined, [Validators.required]],
            zonaPostal: [institucion.zonaPostal || undefined, [Validators.required]],
            direccion: [institucion.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            email: [institucion.email || '', []],
            web: [institucion.web || ''],
            telefono: [institucion.telefono || '', [Validators.required]],
            telefono_alt: [institucion.telefono_alt || ''],
            latitud: [institucion.latitud || '', [Validators.required]],
            longitud: [institucion.longitud || '', [Validators.required]],

        });

        this.f.estado.valueChanges.subscribe(value => {
            this.f.municipio.setValue(undefined);
            this.municipios.next([]);
            this.municipioService.activesByEstado(value).subscribe(data => {
                this.municipios.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.municipio.valueChanges.subscribe(value => {          
            this.f.parroquia.setValue(undefined);
            this.parroquias.next([]); 
            this.parroquiaService.activesByMunicipio(value).subscribe(data => {
                this.parroquias.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.parroquia.valueChanges.subscribe(value => {   
            this.f.zonaPostal.setValue(undefined);
            this.zonasPostales.next([]);     
            this.zonaPostalService.activesByParroquia(value).subscribe(data => {
                this.zonasPostales.next(data);
                this.cdr.detectChanges();
            });
        });

        this.cdr.detectChanges();
        this.printErrors()
    }


    save() {
        if (this.itemForm.invalid)
            return;


        this.updateData(this.institucion);
        this.saveOrUpdate(this.institucionService, this.institucion, 'La  institucion', this.isNew);



    }

}
