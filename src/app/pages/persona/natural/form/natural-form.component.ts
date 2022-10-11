import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { PersonaNatural, PersonaNaturalService } from 'src/@sirio/domain/services/persona/persona-natural.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Genero, GeneroService } from 'src/@sirio/domain/services/configuracion/persona-natural/genero.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { EstadoCivil, EstadoCivilService } from 'src/@sirio/domain/services/configuracion/persona-natural/estado-civil.service';
import { Profesion, ProfesionService } from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import { Tenencia, TenenciaService } from 'src/@sirio/domain/services/configuracion/domicilio/tenencia.service';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ActividadEspecifica, ActividadEspecificaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import { CategoriaEspecial, CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PersonaService } from 'src/@sirio/domain/services/persona/persona.service';

@Component({
    selector: 'app-natural-form',
    templateUrl: './natural-form.component.html',
    styleUrls: ['./natural-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NaturalFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    hasBasicData = true;
    nombreCompletoPersona = 'NOMBRE COMPLETO DE LA PERSONA';
    personaNatural: PersonaNatural = {} as PersonaNatural;




    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    generos = new BehaviorSubject<Genero[]>([]);
    paises = new BehaviorSubject<Pais[]>([]);
    nacionadades = new BehaviorSubject<Pais[]>([]);
    estadosCiviles = new BehaviorSubject<EstadoCivil[]>([]);
    profesiones = new BehaviorSubject<Profesion[]>([]);
    tenencias = new BehaviorSubject<Tenencia[]>([]);
    actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);
    actividadesEspecificas = new BehaviorSubject<ActividadEspecifica[]>([]);
    categoriasEspeciales = new BehaviorSubject<CategoriaEspecial[]>([]);
    //fuenteIngreso = new BehaviorSubject<FuenteIngreso[]>([]);

    


    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();



    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private personaService: PersonaService,
        private personaNaturalService: PersonaNaturalService,
        private tipoDocumentoService: TipoDocumentoService,
        private paisService: PaisService,
        private estadoCivilService: EstadoCivilService,
        private generoService: GeneroService,
        private profesionService: ProfesionService,
        private tenenciaService: TenenciaService,
        private actividadEconomicaService: ActividadEconomicaService,
        private actividadEspecificaService: ActividadEspecificaService,
        private categoriaEspecialService: CategoriaEspecialService,
        private direccionService: DireccionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }


    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                if (this.f.actividadEconomica.value) {
                    this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                        this.actividadesEspecificas.next(data);
                        // this.cdr.detectChanges();
                    });
                }

            }
        });

    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);//TODO: CON ESTO, LUEGO DEBEMOS MANEJAR LOS EVENTOS DE CARGA DE DATA


        // SI ESTOY EN EDICIÓM ME VIENE UN ID, DEBEO OBTENER LA INFORMACIÓN BASICA
        if (id) {
            this.personaNaturalService.get(id).subscribe((persona: PersonaNatural) => {
                this.personaNatural = persona;
                this.buildForm(persona);
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.personaNatural);
            this.loadingDataForm.next(false);
        }



        // this.buildForm(this.personaNatural);
        this.loadingDataForm.next(false);

        this.tipoDocumentoService.activesByTipoPersona(GlobalConstants.PERSONA_NATURAL).subscribe(data => {
            this.tipoDocumentos.next(data);
        });

        this.generoService.actives().subscribe(data => {
            this.generos.next(data);
        });

        this.paisService.actives().subscribe(data => {
            this.paises.next(data);
        });

        this.paisService.gentilicios().subscribe(data => {
            this.nacionadades.next(data);
        });

        this.estadoCivilService.actives().subscribe(data => {
            this.estadosCiviles.next(data);
        });

        this.profesionService.actives().subscribe(data => {
            this.profesiones.next(data);
        });

        this.tenenciaService.actives().subscribe(data => {
            this.tenencias.next(data);
        });

        this.actividadEconomicaService.actives().subscribe(data => {
            this.actividadesEconomicas.next(data);
        });

        this.categoriaEspecialService.actives().subscribe(data => {
            this.categoriasEspeciales.next(data);
        });

        //this.categoriaEspecialService.actives().subscribe(data => {
        //    this.categoriasEspeciales.next(data);
        //});

        // TODO: DEBEO VERIFICAR ESTO DESPUES, LA LISTA DEBE SER CARGADA CUANDO SE ABRAR EL ACORDION



        //TODO: OJO ESTO NO VA ACA obtener la persona dado el tipo de documento e identificacion
        this.f.identificacion.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        ).subscribe(() => {
            // se busca los dato que el usuario suministro      
            const tipoDocumento = this.f.tipoDocumento.value;
            const identificacion = this.f.identificacion.value;

            console.log(tipoDocumento);
            console.log(identificacion);


            if (tipoDocumento && identificacion) {
                this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                    console.log("resutado:", data);
                    if (data.id) {
                        this.isNew = false;
                        this.loadingDataForm.next(true);
                        this.personaNaturalService.get(data.id).subscribe(val => {

                            this.personaNatural = val;

                            console.log('PERSONAAAA: ', val);

                            //TODO: OJO REVISAR ESTO LUEGO
                            this.buildForm(this.personaNatural);
                            this.loadingDataForm.next(false);
                            this.cdr.detectChanges();
                        })

                    }

                }, err => {
                    //console.log(err);
                    // this.f.identificacion.setErrors({ notexists: true });
                    this.personaNatural = {} as PersonaNatural;
                    this.cdr.detectChanges();
                })
            }
        });

    }

    buildForm(personaNatural: PersonaNatural) {
        this.itemForm = this.fb.group({
            tipoDocumento: new FormControl(personaNatural.tipoDocumento || undefined, [Validators.required]),
            identificacion: new FormControl(personaNatural.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            fechaNacimiento: new FormControl(personaNatural.fechaNacimiento ? moment(personaNatural.fechaNacimiento, 'DD/MM/YYYY') : '', [Validators.required]),
            pais: new FormControl(personaNatural.pais || undefined, [Validators.required]),
            primerNombre: new FormControl(personaNatural.primerNombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            segundoNombre: new FormControl(personaNatural.segundoNombre || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            primerApellido: new FormControl(personaNatural.primerApellido || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            segundoApellido: new FormControl(personaNatural.segundoApellido || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            nacionalidad: new FormControl(personaNatural.nacionalidad || undefined, [Validators.required]),
            otraNacionalidad: new FormControl(personaNatural.otraNacionalidad || undefined),
            profesion: new FormControl(personaNatural.profesion || undefined, [Validators.required]),
            genero: new FormControl(personaNatural.genero || undefined, [Validators.required]),
            tenencia: new FormControl(personaNatural.tenencia || undefined, [Validators.required]),
            cargaFamiliar: new FormControl(personaNatural.cargaFamiliar || undefined, [Validators.required]),
            estadoCivil: new FormControl(personaNatural.estadoCivil || undefined, [Validators.required]),
            actividadEconomica: new FormControl(personaNatural.actividadEconomica || undefined, [Validators.required]),
            actividadEspecifica: new FormControl(personaNatural.actividadEspecifica || undefined, [Validators.required]),
            categoriaEspecial: new FormControl(personaNatural.categoriaEspecial || undefined),
            tipoDocumentoConyuge: new FormControl(personaNatural.tipoDocumentoConyuge || undefined),
            identificacionConyuge: new FormControl(personaNatural.identificacionConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            conyuge: new FormControl(personaNatural.conyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            fuenteIngreso: new FormControl(personaNatural.fuenteIngreso || undefined),
            email: new FormControl(personaNatural.email || '', [Validators.required]),
        });



        // verifico si tengo datos basicos cargados
        this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

        this.f.actividadEconomica.valueChanges.subscribe(value => {
            this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                this.actividadesEspecificas.next(data);
                this.cdr.detectChanges();
            });
        });

    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.personaNatural);


        console.log(this.personaNatural);
        this.personaNatural.fechaNacimiento = this.personaNatural.fechaNacimiento.format('DD/MM/YYYY');


        this.saveOrUpdate(this.personaNaturalService, this.personaNatural, 'El Registro de Persona', this.isNew);
    }

    send() {

        console.log('send data al banco');
    }

    cargarDirecciones() {

        console.log('cargar direcciones');
        this.direccionService.allByPersonaId(this.personaNatural.id).subscribe(data => this.direcciones.next(data.slice()));
    }

    private codigoExists(id) {
        this.personaNaturalService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    // activateOrInactivate() {
    //     if (this.personaNatural.id) {
    //         this.applyChangeStatus(this.personaNaturalService, this.personaNatural, this.personaNatural.identificacion, this.cdr);
    //     }
    // }

}
