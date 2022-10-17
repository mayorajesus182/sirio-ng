import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Tenencia, TenenciaService } from 'src/@sirio/domain/services/configuracion/domicilio/tenencia.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { ActividadEspecifica, ActividadEspecificaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import { CategoriaEspecial, CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { EstadoCivil, EstadoCivilService } from 'src/@sirio/domain/services/configuracion/persona-natural/estado-civil.service';
import { Genero, GeneroService } from 'src/@sirio/domain/services/configuracion/persona-natural/genero.service';
import { Profesion, ProfesionService } from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion.service';
import { PersonaNatural, PersonaNaturalService } from 'src/@sirio/domain/services/persona/persona-natural.service';
import { PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import { DireccionFormPopupComponent } from '../../direccion/popup/direccion-form.popup.component';

@Component({
    selector: 'app-natural-form',
    templateUrl: './natural-form.component.html',
    styleUrls: ['./natural-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NaturalFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    searchForm: FormGroup;
    hasBasicData = false;
    showAddress = false;
    btnCreateDisabled = true;
    nombreCompletoPersona = 'FULL NAME';
    personaNatural: PersonaNatural = {} as PersonaNatural;
    constante = GlobalConstants;
    estado_civil: string;
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    refreshDirecciones = new BehaviorSubject<boolean>(false);
    generos = new BehaviorSubject<Genero[]>([]);
    paises = new BehaviorSubject<Pais[]>([]);
    nacionadades = new BehaviorSubject<Pais[]>([]);
    estadosCiviles = new BehaviorSubject<EstadoCivil[]>([]);
    profesiones = new BehaviorSubject<Profesion[]>([]);
    tenencias = new BehaviorSubject<Tenencia[]>([]);
    actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);
    actividadesEspecificas = new BehaviorSubject<ActividadEspecifica[]>([]);
    categoriasEspeciales = new BehaviorSubject<CategoriaEspecial[]>([]);
    
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
        super(dialog, injector);
    }

    get search(){
        return this.searchForm ? this.searchForm.controls : {};
    }


    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                if (this.f.actividadEconomica && this.f.actividadEconomica.value) {
                    this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                        this.actividadesEspecificas.next(data);
                        // this.cdr.detectChanges();
                    });
                }
                this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

                if (this.f.estadoCivil && this.f.estadoCivil.value) {

                    this.estado_civil = this.f.estadoCivil.value;
                }
            }
        });

    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);//TODO: CON ESTO, LUEGO DEBEMOS MANEJAR LOS EVENTOS DE CARGA DE DATA


        this.searchForm = this.fb.group({
            tipoDocumento: new FormControl( undefined, [Validators.required]),
            identificacion: new FormControl( '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)])
        });

        // SI ESTOY EN EDICIÓM ME VIENE UN ID, DEBEO OBTENER LA INFORMACIÓN BASICA
        if (id) {
            this.personaNaturalService.get(id).subscribe((persona: PersonaNatural) => {
                this.personaNatural = persona;
                // this.buildForm(persona); //TODO: POR AHORA
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            // TODO: REVISAR LUEGO
            // this.buildForm(this.personaNatural);
            // this.loadingDataForm.next(false);
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
        this.search.identificacion.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000)// espera 1 seg
        ).subscribe(() => {
            // se busca los dato que el usuario suministro      
            const tipoDocumento = this.search.tipoDocumento.value;
            const identificacion = this.search.identificacion.value;
            this.btnCreateDisabled=true;
            this.loaded$.next(false);
            // console.log(tipoDocumento);
            // console.log(identificacion);

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
                            // this.itemForm.reset({});
                            this.buildForm(this.personaNatural);
                            this.loadingDataForm.next(false);
                            this.loaded$.next(true);
                            this.cdr.detectChanges();
                        })

                    }
                    
                }, err => {
                    //console.log(err);
                    if(this.itemForm){
                        this.itemForm.reset({});
                    }
                    this.isNew=true;
                    this.personaNatural = {} as PersonaNatural;
                    this.btnCreateDisabled=false;
                    // this.buildForm(this.personaNatural);
                    this.loadingDataForm.next(false);
                    this.search.identificacion.setErrors({ notexists: true });
                    this.loaded$.next(false);
                    this.cdr.detectChanges();
                })
            }
        });

    }

    buildForm(personaNatural: PersonaNatural) {
        // 
        
        this.itemForm = this.fb.group({
            tipoDocumento: new FormControl(personaNatural.tipoDocumento || undefined, [Validators.required]),
            identificacion: new FormControl(personaNatural.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            fechaNacimiento: new FormControl(personaNatural.fechaNacimiento ? moment(personaNatural.fechaNacimiento, 'DD/MM/YYYY') : '', [Validators.required]),
            pais: new FormControl(personaNatural.pais || undefined, [Validators.required]),
            primerNombre: new FormControl(personaNatural.primerNombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            segundoNombre: new FormControl(personaNatural.segundoNombre || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            primerApellido: new FormControl(personaNatural.primerApellido || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            segundoApellido: new FormControl(personaNatural.segundoApellido || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
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
            nombreConyuge: new FormControl(personaNatural.nombreConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            fuenteIngreso: new FormControl(personaNatural.fuenteIngreso || undefined),
            email: new FormControl(personaNatural.email || '', [Validators.required]),
        });

        // verifico si tengo datos basicos cargados
        // this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

        this.f.actividadEconomica.valueChanges.subscribe(value => {
            if(value){
                this.f.actividadEspecifica.setValue('');

                this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                    this.actividadesEspecificas.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.f.estadoCivil.valueChanges.subscribe(val => {
            if(val){

                this.estado_civil = val;
                if(!this.evaluarEstadoCivil()){
                    // si esta evaluacion retorna false , es que no es casado, ni union estable
                    this.addOrRemoveFieldValidator('tipoDocumentoConyuge',false)
                    this.addOrRemoveFieldValidator('identificacionConyuge',false,'')
                    this.addOrRemoveFieldValidator('nombreConyuge',false,'')
                    this.addOrRemoveFieldValidator('fuenteIngreso',false)
    
    
    
                    this.cdr.detectChanges();
    
                }
            }

        })

    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.personaNatural);


        // console.log(this.personaNatural);
        this.personaNatural.fechaNacimiento = this.personaNatural.fechaNacimiento.format('DD/MM/YYYY');


        // this.saveOrUpdate(this.personaNaturalService, this.personaNatural, 'El Registro de Persona').subscribe(resp=>console.log(resp));

        if (this.isNew) {

            this.personaNaturalService.save(this.personaNatural).subscribe(data => {                
                console.log(data);
                
                this.personaNatural= data;
                this.successResponse('La persona', 'creada' );
                this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

                
            }, error => this.errorResponse(true));

        } else {
            this.personaNaturalService.update(this.personaNatural).subscribe(data => {

                this.successResponse('La persona', 'actualizada');
            }, error => this.errorResponse(false));
        }
        
    }

    send() {

        console.log('send data al banco');
    }

    add() {
        console.log('add new person');
        this.buildForm(this.personaNatural);
        this.loaded$.next(true);
    }


    evaluarEstadoCivil():boolean {
        return this.estado_civil == this.constante.CASADO || this.estado_civil == this.constante.UNION_ESTABLE;
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

    editAddress(data:Direccion) {
        this.showFormPopup(DireccionFormPopupComponent, !data?{persona:this.personaNatural.id}:data, !data,'60%').afterClosed().subscribe(event=>{
            if(event){
                this.refreshDirecciones.next(true);
            }
        }); 
    }

    openAddress() {
        this.showAddress=!this.showAddress; 
        this.cdr.detectChanges();
    }

}
