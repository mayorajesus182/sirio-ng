import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {fadeInRightAnimation} from 'src/@sirio/animations/fade-in-right.animation';
import {fadeInUpAnimation} from 'src/@sirio/animations/fade-in-up.animation';
import {GlobalConstants, RegularExpConstants} from 'src/@sirio/constants';
import {PersonaConstants} from 'src/@sirio/constants/persona.constants';
import {CalendarioService} from 'src/@sirio/domain/services/calendario/calendar.service';
import {Tenencia, TenenciaService} from 'src/@sirio/domain/services/configuracion/domicilio/tenencia.service';
import {Pais, PaisService} from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import {
    ActividadEconomica,
    ActividadEconomicaService
} from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import {
    ActividadEspecifica,
    ActividadEspecificaService
} from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import {
    CategoriaEspecial,
    CategoriaEspecialService
} from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import {EstadoCivil, EstadoCivilService} from 'src/@sirio/domain/services/configuracion/persona-natural/estado-civil.service';
import {Genero, GeneroService} from 'src/@sirio/domain/services/configuracion/persona-natural/genero.service';
import {Profesion, ProfesionService} from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import {TipoDocumento, TipoDocumentoService} from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import {Direccion} from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import {PersonaDataMandatoryService} from 'src/@sirio/domain/services/persona/persona-data-mandatory.service';
import {PersonaNatural, PersonaNaturalService} from 'src/@sirio/domain/services/persona/persona-natural.service';
import {Persona, PersonaService} from 'src/@sirio/domain/services/persona/persona.service';
import {FormBaseComponent} from 'src/@sirio/shared/base/form-base.component';
import {Email, EmailExistService} from '../../../../../@sirio/domain/services/persona/email/email-exist-service';
import {Cheque} from '../../../../../@sirio/domain/services/taquilla/deposito.service';


@Component({
    selector: 'app-natural-form',
    templateUrl: './natural-form.component.html',
    styleUrls: ['./natural-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NaturalFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    fromOtherComponent: boolean = false;
    todayValue: moment.Moment = moment();
    totalAddress: number;
    @ViewChild('email') email: ElementRef;

    totalRegistroMercantil: number;

    totalInfoLab: number;
    totalPep: number;
    totalApoderado: number;
    totalPhone: number;
    totalBankReference: number;
    totalPersonalReference: number;
    totalContact: number;
    searchForm: FormGroup;
    hasOwnBusiness = false;
    hasBasicData = false;
    showAddress = false;

    chequeList: any[] = [];
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
    constants = PersonaConstants;
    estado_civil: string;

    tipoDocumento = undefined;
    tipoPersona = 'F';
    identificacion = undefined;
    tipo_DocumentoMenor: string;
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    refreshDirecciones = new BehaviorSubject<boolean>(false);
    generos = new BehaviorSubject<Genero[]>([]);


    existsEmail = new BehaviorSubject<Email[]>([]);
    //existsEmail = String  ;
    paises = new BehaviorSubject<Pais[]>([]);
    nacionadades = new BehaviorSubject<Pais[]>([]);
    estadosCiviles = new BehaviorSubject<EstadoCivil[]>([]);
    profesiones = new BehaviorSubject<Profesion[]>([]);
    tenencias = new BehaviorSubject<Tenencia[]>([]);
    actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);
    actividadesEspecificas = new BehaviorSubject<ActividadEspecifica[]>([]);
    categoriasEspeciales = new BehaviorSubject<CategoriaEspecial[]>([]);

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();


    warnings$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private mandatoyDataService: PersonaDataMandatoryService,
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
        private calendarioService: CalendarioService,
        private emailExistService: EmailExistService,
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
        GlobalConstants.TIPO_PERSONA = 'N';

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

        this.actividadEspecificaService.actives().subscribe(data => {
            this.actividadesEspecificas.next(data);
        });

        this.categoriaEspecialService.actives().subscribe(data => {
            this.categoriasEspeciales.next(data);
        });


        this.route.paramMap.subscribe(data => {
            if (data.get('doc') && data.get('tdoc')) {
                this.fromOtherComponent = true;

                this.personaNatural.identificacion = data.get('doc');
                this.personaNatural.tipoDocumento = data.get('tdoc');

                this.isNew = this.router.url.endsWith('/add') || this.router.url.endsWith('/edit');

                this.buildForm();
                this.loaded$.next(true);

                this.personaService.getByTipoDocAndIdentificacion(data.get('tdoc'), data.get('doc')).subscribe(p => {

                    this.updatePerson(p);

                    if (p.id) {

                        this.mandatoyDataService.validate(p.id).subscribe(errors => {

                            this.warnings$.next(this.mandatoyDataService.errorsToHtml(errors));

                        });

                    }

                }, error => {
                    this.isNew = true;

                });
            }
        });


        this.cdr.detectChanges();

    }

    buildForm() {
        // 

        this.itemForm = this.fb.group({
            tipoDocumento: new FormControl({value: this.personaNatural.tipoDocumento, disabled: true}, [Validators.required]),

            // this.tipoDocumentos.value = 'P'  {

            identificacion: new FormControl({
                value: this.personaNatural.identificacion,
                disabled: true
            } || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),


            fechaNacimiento: new FormControl(this.personaNatural.fechaNacimiento ? moment(this.personaNatural.fechaNacimiento, 'DD/MM/YYYY') : '', [Validators.required]),
            pais: new FormControl(this.personaNatural.pais || undefined, [Validators.required]),
            primerNombre: new FormControl(this.personaNatural.primerNombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            segundoNombre: new FormControl(this.personaNatural.segundoNombre || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            primerApellido: new FormControl(this.personaNatural.primerApellido || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            segundoApellido: new FormControl(this.personaNatural.segundoApellido || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            nacionalidad: new FormControl(this.personaNatural.nacionalidad || undefined, [Validators.required]),
            otraNacionalidad: new FormControl(this.personaNatural.otraNacionalidad || undefined),
            profesion: new FormControl(this.personaNatural.profesion || undefined, [Validators.required]),
            genero: new FormControl(this.personaNatural.genero || undefined, [Validators.required]),
            tenencia: new FormControl(this.personaNatural.tenencia || undefined, [Validators.required]),
            cargaFamiliar: new FormControl(this.personaNatural.cargaFamiliar != undefined ? this.personaNatural.cargaFamiliar : '', [Validators.required]),
            estadoCivil: new FormControl(this.personaNatural.estadoCivil || undefined, [Validators.required]),
            actividadEconomica: new FormControl(this.personaNatural.actividadEconomica || undefined, [Validators.required]),
            actividadEspecifica: new FormControl(this.personaNatural.actividadEspecifica || undefined, [Validators.required]),
            categoriaEspecial: new FormControl(this.personaNatural.categoriaEspecial || undefined, [Validators.required]),
            tipoDocumentoConyuge: new FormControl(this.personaNatural.tipoDocumentoConyuge || undefined),
            identificacionConyuge: new FormControl(this.personaNatural.identificacionConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombreConyuge: new FormControl(this.personaNatural.nombreConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            fuenteIngreso: new FormControl(this.personaNatural.fuenteIngreso || undefined),
            email: new FormControl(this.personaNatural.email || '', [Validators.required]),
        });

        // verifico si tengo datos basicos cargados
        // this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_NATURAL).subscribe(data => {
            this.tipoDocumentos.next(data);
            const tipo = data.filter(t => t.id == this.f.tipoDocumento.value)[0];
            if (tipo) {
                this.f.tipoDocumento.setValue(tipo.nombre);

            } else {
                this.f.tipoDocumento.setValue('');
            }
        });

        this.f.email.valueChanges.subscribe(value => {
        //this.eventFromElement(this.email, 'keyup')?.subscribe(() => {
            if (!this.f.email.invalid) {

                this.emailExistService.get(value,this.f.identificacion.value).subscribe(data => {

                    if (data.exists) {
                        this.f.email.setErrors({exists2: true});
                        this.f.email.markAsDirty();
                        this.cdr.detectChanges();

                    }


                });

            }


        });





        this.f.identificacionConyuge.valueChanges.subscribe(value => {

            if (value) {
                if (this.validateTitular(this.f.tipoDocumentoConyuge.value ? this.f.tipoDocumentoConyuge.value : undefined, this.f.identificacionConyuge.value ? this.f.identificacionConyuge.value : undefined)) {
                    this.f.identificacionConyuge.setErrors({exists2: true});
                    this.f.identificacionConyuge.markAsDirty();
                    this.cdr.detectChanges();
                }
            }
        });


        this.f.actividadEconomica.valueChanges.subscribe(value => {
            if (value) {
                this.f.actividadEspecifica.setValue(undefined);
                this.actividadEspecificaService.activesByActividadEconomica(this.f.actividadEconomica.value).subscribe(data => {
                    this.actividadesEspecificas.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.f.actividadEspecifica.valueChanges.subscribe(value => {
            if (value) {
                this.f.categoriaEspecial.setValue(undefined);
                this.categoriaEspecialService.actives().subscribe(data => {
                    this.categoriasEspeciales.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.f.estadoCivil.valueChanges.subscribe(val => {
            if (val) {

                this.estado_civil = val;
                if (!this.evaluarEstadoCivil()) {
                    // si esta evaluacion retorna false , es que no es casado, ni union estable
                    this.addOrRemoveFieldValidator('tipoDocumentoConyuge', false);
                    this.addOrRemoveFieldValidator('identificacionConyuge', false, '');
                    this.addOrRemoveFieldValidator('nombreConyuge', false, '');
                    this.addOrRemoveFieldValidator('fuenteIngreso', false);

                    this.cdr.detectChanges();

                }
            }

        });

        this.f.tipoDocumento.valueChanges.subscribe(val => {
            if (val) {

                this.tipo_DocumentoMenor = val;

            }

        });

    }


    validateTitular(tipoDocumento: string, identificacion: string) {
        if (!identificacion) {
            return true;
        }
        console.log(tipoDocumento + identificacion);
        this.cdr.detectChanges();
        let cadenaExtraida = this.f.tipoDocumento.value.substring(0, 1);
        return cadenaExtraida + this.f.identificacion.value === tipoDocumento + identificacion;
    }


    addPerson(event) {
        this.isNew = true;
        this.updateDataFromValues(this.personaNatural, event);
        this.buildForm();
        this.loaded$.next(true);

    }

    updatePerson(event) {
        if (!event.id) {
            return;
        }
        this.loaded$.next(false);

        this.loadingDataForm.next(true);
        this.isNew = false;

        this.loaded$.next(false);
        this.loadingDataForm.next(true);
        this.personaNaturalService.get(Number.parseInt(event.id)).subscribe(val => {
            this.personaNatural = val;
            // console.log(this.personaNatural);             
            //TODO: OJO REVISAR ESTO LUEGO

            this.buildForm();
            this.loadingDataForm.next(false);
            this.loaded$.next(true);
            // this.applyFieldsDirty();
            this.cdr.detectChanges();
        });


    }

    queryResult(event) {

        if (!event.id && !event.numper) {
            this.loaded$.next(false);
            this.personaNatural = {} as PersonaNatural;
            this.isNew = true;
            this.hasBasicData = false;
            this.cdr.detectChanges();
        }
    }

    save() {
        if (this.itemForm.invalid) {
            return;
        }

        this.updateData(this.personaNatural);
        this.personaNatural.fechaNacimiento = this.personaNatural.fechaNacimiento.format('DD/MM/YYYY');

        if (this.isNew) {

            this.personaNaturalService.save(this.personaNatural).subscribe(data => {
                this.isNew = data.id == undefined;
                this.personaNatural = data;
                this.successResponse('La persona', 'creada', true);
                this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;


            }, error => this.errorResponse(true));

        } else {
            this.personaNaturalService.update(this.personaNatural).subscribe(data => {

                this.successResponse('La persona', 'actualizada', true);
            }, error => this.errorResponse(false));
        }

    }

    send() {
        this.disabled$.next(true);


        this.mandatoyDataService.validate(this.personaNatural.id).subscribe(data => {
            console.log('errors', data);
            this.loadingDataForm.next(true);

            if (data.length == 0) {
                // si no tengo errores pido confirmación de lo contrario muestro los errores
                this.swalService.show('¿Desea realmente realizar esta operación?',).then((resp) => {

                    if (!resp.dismiss) {

                        this.personaService.send(this.personaNatural.id).subscribe(() => {

                            this.successResponse('Operacion', 'aplicada', true);
                            this.loadingDataForm.next(false);
                            this.disabled$.next(false);
                            this.router.navigate([sessionStorage.getItem(GlobalConstants.PREV_PAGE)]);

                        }, err => {
                            this.errorResponse(err);
                        });

                    } else {
                        this.disabled$.next(false);
                    }

                });

            } else {
                this.loadingDataForm.next(false);
                this.disabled$.next(false);
                this.mandatoyDataService.showErrorsAndRedirect(data, this.personaNatural as Persona);
                // this.errors=data;
                // this.cdr.detectChanges();
            }


        });
    }


    evaluarEstadoCivil(): boolean {
        return this.estado_civil == this.constants.CASADO || this.estado_civil == this.constants.UNION_ESTABLE;
    }

    evaluarTipoDocumentoMenor(): boolean {
        return this.tipo_DocumentoMenor == this.constants.TIPDOC_MENOR;
    }

    updateAddress(event) {
        this.totalAddress = event;
    }

    setHasBusiness(event) {
        this.hasOwnBusiness = event;
        console.log('has businnes ', event);
        this.cdr.detectChanges();

    }

    updatePep(event) {
        this.totalPep = event;
    }

    updateApoderado(event) {
        this.totalApoderado = event;
    }

    updateEmpresaRelacionada(event) {
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
