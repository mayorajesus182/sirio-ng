import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
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
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PersonaNatural, PersonaNaturalService } from 'src/@sirio/domain/services/persona/persona-natural.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import * as moment from 'moment';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';

@Component({
    selector: 'app-natural-form',
    templateUrl: './natural-form.component.html',
    styleUrls: ['./natural-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NaturalFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    todayValue: moment.Moment;
    totalAddress: number;

    totalRegistroMercantil : number;

    totalInfoLab: number;
    totalPep: number;
    totalApoderado: number;

    totalPhone: number;
    totalBankReference: number;
    totalPersonalReference: number;
    totalContact: number;
    searchForm: FormGroup;
    hasBasicData = false;
    showAddress = false;

    showRegistroMercantil = false;
    showPersonalReference = false;
    showBankReference = false;
    showPep = false;
    showApoderado = false;
    showPhone = false;

    showEmpresaRelacionada = false;

    showInformacionLaboral = false;
    btnCreateDisabled = true;
    nombreCompletoPersona = 'FULL NAME';
    personaNatural: PersonaNatural = {} as PersonaNatural;
    constants = GlobalConstants;
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
        protected router: Router,
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
        private calendarioService: CalendarioService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    get search() {
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


        this.loadingDataForm.next(false);

        this.calendarioService.today().subscribe(data => {
            this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
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

        this.cdr.detectChanges();

    }

    buildForm(personaNatural: PersonaNatural) {
        // 

        this.itemForm = this.fb.group({
            tipoDocumento: new FormControl({ value: personaNatural.tipoDocumento, disabled: true }, [Validators.required]),
            identificacion: new FormControl({ value: personaNatural.identificacion, disabled: true } || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
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
            cargaFamiliar: new FormControl(personaNatural.cargaFamiliar != undefined ? personaNatural.cargaFamiliar : '', [Validators.required]),
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

        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_NATURAL).subscribe(data => {
            this.tipoDocumentos.next(data);
            const tipo = data.filter(t => t.id == this.f.tipoDocumento.value)[0];
            this.f.tipoDocumento.setValue( tipo.nombre);
        });


        this.f.actividadEconomica.valueChanges.subscribe(value => {
            if (value) {
                this.f.actividadEspecifica.setValue('');

                this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                    this.actividadesEspecificas.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.f.estadoCivil.valueChanges.subscribe(val => {
            if (val) {

                this.estado_civil = val;
                if (!this.evaluarEstadoCivil()) {
                    // si esta evaluacion retorna false , es que no es casado, ni union estable
                    this.addOrRemoveFieldValidator('tipoDocumentoConyuge', false)
                    this.addOrRemoveFieldValidator('identificacionConyuge', false, '')
                    this.addOrRemoveFieldValidator('nombreConyuge', false, '')
                    this.addOrRemoveFieldValidator('fuenteIngreso', false)



                    this.cdr.detectChanges();

                }
            }

        })

    }


    addPerson(event) {
        //console.log('create ', event);
        //console.log('add new person');
        this.isNew = true;
        this.updateDataFromValues(this.personaNatural, event);
        this.buildForm(this.personaNatural);
        this.loaded$.next(true);
        // if(this.itemForm){
        //     this.f.tipoDocumento.setValue(this.personaNatural.tipoDocumento);
        //     this.f.identificacion.setValue(this.personaNatural.identificacion);
        // }

    }

    updatePerson(event) {
        //console.log('update ', event);
        if (!event.id) {
            return;
        }
        this.loaded$.next(false);

        this.loadingDataForm.next(true);
        this.isNew = false;
        //console.log('current loaded ', this.loaded$.value);

        this.loaded$.next(false);
        this.loadingDataForm.next(true);
        this.personaNaturalService.get(Number.parseInt(event.id)).subscribe(val => {
            this.personaNatural = val;
            //console.log('PERSONAAAA: ', val);
            //TODO: OJO REVISAR ESTO LUEGO
            // this.itemForm.reset({});
            this.buildForm(this.personaNatural);
            this.loadingDataForm.next(false);
            this.loaded$.next(true);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });
        // this.router.navigate([`/sirio/persona/natural/${event.id}/edit`]);
    }

    queryResult(event) {
        //console.log('event result ', event);

        if (!event.id && !event.numper) {
            this.loaded$.next(false);
            this.personaNatural = {} as PersonaNatural;
            this.isNew = true;
            this.cdr.detectChanges();
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.personaNatural);

        // console.log(this.personaNatural);
        this.personaNatural.fechaNacimiento = this.personaNatural.fechaNacimiento.format('DD/MM/YYYY');


        // this.saveOrUpdate(this.personaNaturalService, this.personaNatural, 'El Registro de Persona').subscribe(resp=>//console.log(resp));

        if (this.isNew) {

            this.personaNaturalService.save(this.personaNatural).subscribe(data => {
                //console.log(data);

                this.personaNatural = data;
                this.successResponse('La persona', 'creada',true);
                this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;


            }, error => this.errorResponse(true));

        } else {
            this.personaNaturalService.update(this.personaNatural).subscribe(data => {

                this.successResponse('La persona', 'actualizada',true);
            }, error => this.errorResponse(false));
        }

    }

    send() {

        //console.log('send data al banco');
    }



    evaluarEstadoCivil(): boolean {
        return this.estado_civil == this.constants.CASADO || this.estado_civil == this.constants.UNION_ESTABLE;
    }


    updateAddress(event) {
        this.totalAddress = event;
    }

    updateWorkingInfo(event) {
        this.totalInfoLab = event;
    }

    updatePep(event) {
        this.totalPep = event;
    }

    updateApoderado(event) {
        //console.log('apoderado', event);
        this.totalApoderado = event;
    }

    updateEmpresaRelacionada(event) {
        //console.log('peps', event);
        this.totalPep = event;
    }

    //openAddress() {
    openInformacionLaboral(opened: boolean) {

        this.showInformacionLaboral = opened;
        this.cdr.detectChanges();
    }

    openPep(opened: boolean) {

        this.showPep = opened;
        this.cdr.detectChanges();
    }

    openApoderado(opened: boolean) {

        this.showApoderado = opened;
        this.cdr.detectChanges();
    }

    openPhones(opened: boolean) {

        this.showPhone = opened;
        this.cdr.detectChanges();
    }

    openEmpresaRelacionada(opened: boolean) {

        this.showEmpresaRelacionada = opened;
        this.cdr.detectChanges();
    }

    openAddress(opened: boolean) {
        this.showAddress = opened;
        this.cdr.detectChanges();
    }
    openBankReference(opened: boolean) {
        this.showBankReference = opened;
        this.cdr.detectChanges();
    }

    openPersonalReference(opened: boolean) {
        this.showPersonalReference = opened;
        this.cdr.detectChanges();
    }


}
