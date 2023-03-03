import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { ActividadEspecifica, ActividadEspecificaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import { CategoriaEspecial, CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PersonaDataMandatoryService } from 'src/@sirio/domain/services/persona/persona-data-mandatory.service';
import { PersonaJuridica, PersonaJuridicaService } from 'src/@sirio/domain/services/persona/persona-juridica.service';
import { PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-juridico-form',
    templateUrl: './juridico-form.component.html',
    styleUrls: ['./juridico-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class JuridicoFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    fromOtherComponent: boolean = false;
    todayValue: moment.Moment = moment();
    
    totalAddress: number;
    totalInfoLab: number;
    totalPep: number;
    totalApoderado: number;

    totalAccionistaDirectivo: number;

    totalPhone: number;
    totalBankReference: number;
    totalPersonalReference: number;
    totalContact: number;
    searchForm: FormGroup;
    hasBasicData = false;
    showAddress = false;
    showPersonalReference = false;
    showBankReference = false;
    showPep = false;
    showApoderado = false;
    showPhone = false;

    showAccionistaDirectivo = false;

    showRegistroMercantil = false;

    showEmpresaRelacionada = false;

    showInformacionLaboral = false;
    btnCreateDisabled = true;
    nombreCompletoPersona = 'FULL NAME';

    personaJuridica: PersonaJuridica = {} as PersonaJuridica;
    constants = GlobalConstants;
    estado_civil: string;
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    refreshDirecciones = new BehaviorSubject<boolean>(false);

    paises = new BehaviorSubject<Pais[]>([]);
    nacionadades = new BehaviorSubject<Pais[]>([]);

    actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);
    actividadesEspecificas = new BehaviorSubject<ActividadEspecifica[]>([]);
    categoriasEspeciales = new BehaviorSubject<CategoriaEspecial[]>([]);

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private personaJuridicaService: PersonaJuridicaService,
        private mandatoyDataService: PersonaDataMandatoryService,
        private tipoDocumentoService: TipoDocumentoService,
        private paisService: PaisService,
        private calendarioService: CalendarioService,
        private actividadEconomicaService: ActividadEconomicaService,
        private actividadEspecificaService: ActividadEspecificaService,
        private categoriaEspecialService: CategoriaEspecialService,
        private personaService: PersonaService,
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

                this.hasBasicData = this.personaJuridica.id != undefined || this.personaJuridica.numper != undefined;

            }
        });

    }

    ngOnInit() {
        GlobalConstants.TIPO_PERSONA = 'J';

        this.loadingDataForm.next(false);

        this.calendarioService.today().subscribe(data => {
            this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
            this.cdr.detectChanges();
        });

        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_JURIDICA).subscribe(data => {
            this.tipoDocumentos.next(data);
        });

        this.paisService.actives().subscribe(data => {
            this.paises.next(data);
        });

        this.paisService.gentilicios().subscribe(data => {
            this.nacionadades.next(data);
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

      

        // if(this.f.montoDeclarado.value == null){
        //     descripcion.append("<b>Ramo: </b>").append(ramoGetService.getById(i.getRamo()).get().getNombre()).append(" ");
        // }



        this.route.paramMap.subscribe(data => {

            if (data.get('doc') && data.get('tdoc')) {
                this.fromOtherComponent = true;

                this.personaJuridica.identificacion = data.get('doc');
                this.personaJuridica.tipoDocumento = data.get('tdoc');

                this.isNew = this.router.url.endsWith('/add') || this.router.url.endsWith('/edit');
                
                this.buildForm();
                this.loaded$.next(true);
                
                this.personaService.getByTipoDocAndIdentificacion(data.get('tdoc'), data.get('doc')).subscribe(p => {

                    this.updatePerson(p);

                }, error => {
                    this.isNew = true;
                    
                });
            }
        });


    }

    buildForm() {
        // personaJuridica

        this.itemForm = this.fb.group({

            tipoDocumento: new FormControl({ value: this.personaJuridica.tipoDocumento, disabled: true }, [Validators.required]),
            identificacion: new FormControl({ value: this.personaJuridica.identificacion, disabled: true } || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            pais: new FormControl(this.personaJuridica.pais || undefined, [Validators.required]),
            razonSocial: new FormControl(this.personaJuridica.razonSocial || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            nombreComercial: new FormControl(this.personaJuridica.nombreComercial || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            nacionalidad: new FormControl(this.personaJuridica.nacionalidad || undefined, [Validators.required]),
            actividadEconomica: new FormControl(this.personaJuridica.actividadEconomica || undefined, [Validators.required]),
            actividadEspecifica: new FormControl(this.personaJuridica.actividadEspecifica || undefined, [Validators.required]),
            categoriaEspecial: new FormControl(this.personaJuridica.categoriaEspecial || undefined, [Validators.required]),
            oficinas: new FormControl(this.personaJuridica.oficinas != undefined ? this.personaJuridica.oficinas : '', [Validators.required]),
            empleados: new FormControl(this.personaJuridica.empleados != undefined ? this.personaJuridica.empleados : '', [Validators.required]),
            ventas: new FormControl(this.personaJuridica.ventas || undefined ? this.personaJuridica.ventas : '', [Validators.required]),
            ingresos: new FormControl(this.personaJuridica.ingresos || undefined ? this.personaJuridica.ingresos : '', [Validators.required]),
            egresos: new FormControl(this.personaJuridica.egresos || undefined ? this.personaJuridica.egresos : '', [Validators.required]),
            anhoDeclaracion: new FormControl(this.personaJuridica.anhoDeclaracion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            montoDeclarado: new FormControl(this.personaJuridica.montoDeclarado || undefined ? this.personaJuridica.montoDeclarado : '', [Validators.required]),
            email: new FormControl(this.personaJuridica.email || '', [Validators.required]),
            web: new FormControl(this.personaJuridica.web || '')

            //[Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
        });

        // verifico si tengo datos basicos cargados
        // this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_JURIDICA).subscribe(data => {
            this.tipoDocumentos.next(data);
            const tipo = data.filter(t => t.id == this.f.tipoDocumento.value)[0];
            this.f.tipoDocumento.setValue(tipo.nombre);
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

        this.f.montoDeclarado.valueChanges.subscribe(val => {
            if (val === null || val == undefined) {
                this.f.montoDeclarado.setValue(0.00);
                this.cdr.detectChanges();
            }
        });

    }


    addPerson(event) {
        this.isNew = true;
        this.updateDataFromValues(this.personaJuridica, event);
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
        
        this.personaJuridicaService.get(Number.parseInt(event.id)).subscribe(val => {
            this.personaJuridica = val;
            //TODO: OJO REVISAR ESTO LUEGO            
            this.buildForm();
            this.loadingDataForm.next(false);
            this.loaded$.next(true);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });

        // // realizo verificación de la info minima para el cliente
        // this.mandatoyDataService.validate(Number.parseInt(event.id)).subscribe(data => {
        //     console.log('errors', data);
        //     this.errors = data;
        // });




    }

    queryResult(event) {
        console.log(event)
        if (!event.id && !event.numper) {
            this.loaded$.next(false);
            this.personaJuridica = {} as PersonaJuridica;
            this.isNew = true;
            this.cdr.detectChanges();
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.personaJuridica);

        if (this.isNew) {

            this.personaJuridicaService.save(this.personaJuridica).subscribe(data => {

                this.isNew = data.id == undefined;
                this.personaJuridica = data;
                this.successResponse('La persona', 'creada', true);
                this.hasBasicData = this.personaJuridica.id != undefined || this.personaJuridica.numper != undefined;


            }, error => this.errorResponse(true));

        } else {
            this.personaJuridicaService.update(this.personaJuridica).subscribe(data => {

                this.successResponse('La persona', 'actualizada', true);
            }, error => this.errorResponse(false));
        }

    }


    send() {
        this.disabled$.next(true);

        this.mandatoyDataService.validate(this.personaJuridica.id).subscribe(data => {
            console.log('errors', data);
            this.loadingDataForm.next(true);

            if (data.length == 0) {

                this.swalService.show('¿Desea realmente realizar esta operación?',).then((resp) => {

                    if (!resp.dismiss) {

                        this.loadingDataForm.next(true);

                        this.personaService.send(this.personaJuridica.id).subscribe(() => {

                            // simular que fui al servidor para luego enviar a la persona al modulo de apertura
                            this.successResponse('Operacion', 'aplicada', true);
                            this.loadingDataForm.next(false);
                            this.disabled$.next(false);
                            this.router.navigate([sessionStorage.getItem(GlobalConstants.PREV_PAGE)]);


                        }, err => {
                            this.errorResponse(err)
                        });

                    } else {
                        this.disabled$.next(false);
                    }

                });
            }


        });

    }



    evaluarEstadoCivil(): boolean {
        return this.estado_civil == this.constants.CASADO || this.estado_civil == this.constants.UNION_ESTABLE;
    }


    // updateAddress(event){
    //     this.totalAddress= event;
    // }

    updateWorkingInfo(event) {
        this.totalInfoLab = event;
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

    openAddress(opened: boolean) {
        this.showAddress = opened;
        this.cdr.detectChanges();
    }

    openAccionistaDirectivo(opened: boolean) {
        this.showAccionistaDirectivo = opened;
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


    openRegistroMercantil(opened: boolean) {
        this.showRegistroMercantil = opened;
        this.cdr.detectChanges();

    }

    openEmpresaRelacionada(opened: boolean) {

        this.showEmpresaRelacionada = opened;
        this.cdr.detectChanges();
    }
}