import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { ActividadEspecifica, ActividadEspecificaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import { CategoriaEspecial, CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PersonaJuridica, PersonaJuridicaService } from 'src/@sirio/domain/services/persona/persona-juridica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-juridico-form',
    templateUrl: './juridico-form.component.html',
    styleUrls: ['./juridico-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class JuridicoFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

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
    //generos = new BehaviorSubject<Genero[]>([]);
    paises = new BehaviorSubject<Pais[]>([]);
    nacionadades = new BehaviorSubject<Pais[]>([]);
    //estadosCiviles = new BehaviorSubject<EstadoCivil[]>([]);
    //profesiones = new BehaviorSubject<Profesion[]>([]);
    //tenencias = new BehaviorSubject<Tenencia[]>([]);
    actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);
    actividadesEspecificas = new BehaviorSubject<ActividadEspecifica[]>([]);
    categoriasEspeciales = new BehaviorSubject<CategoriaEspecial[]>([]);

//     Integer oficinas;
    
// Integer empleados;
    
// Double ventas;

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private personaJuridicaService: PersonaJuridicaService,

        private tipoDocumentoService: TipoDocumentoService,
        private paisService: PaisService,
        //private estadoCivilService: EstadoCivilService,
        //private generoService: GeneroService,
        //private profesionService: ProfesionService,
        //private tenenciaService: TenenciaService,
        private actividadEconomicaService: ActividadEconomicaService,
        private actividadEspecificaService: ActividadEspecificaService,
        private categoriaEspecialService: CategoriaEspecialService,
        
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

                // if (this.f.estadoCivil && this.f.estadoCivil.value) {

                //     this.estado_civil = this.f.estadoCivil.value;
                // }
            }
        });

    }

    ngOnInit() {

       
        this.loadingDataForm.next(false);

        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_JURIDICA).subscribe(data => {
            this.tipoDocumentos.next(data);
        });

        // this.generoService.actives().subscribe(data => {
        //     this.generos.next(data);
        // });

        this.paisService.actives().subscribe(data => {
            this.paises.next(data);
        });

        this.paisService.gentilicios().subscribe(data => {
            this.nacionadades.next(data);
        });

        // this.estadoCivilService.actives().subscribe(data => {
        //     this.estadosCiviles.next(data);
        // });

        // this.profesionService.actives().subscribe(data => {
        //     this.profesiones.next(data);
        // });

        // this.tenenciaService.actives().subscribe(data => {
        //     this.tenencias.next(data);
        // });

        this.actividadEconomicaService.actives().subscribe(data => {
            this.actividadesEconomicas.next(data);
        });

        this.categoriaEspecialService.actives().subscribe(data => {
            this.categoriasEspeciales.next(data);
        });

    }

    buildForm(personaJuridica: PersonaJuridica) {
        // personaJuridica

        this.itemForm = this.fb.group({
            // tipoDocumento: new FormControl(personaJuridica.tipoDocumento || undefined, [Validators.required]),
            // identificacion: new FormControl(personaJuridica.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            
            tipoDocumento: new FormControl({ value: personaJuridica.tipoDocumento, disabled: true }, [Validators.required]),
            identificacion: new FormControl({ value: personaJuridica.identificacion, disabled: true } || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            
            
            // fechaNacimiento: new FormControl(personaJuridica.fechaNacimiento ? moment(personaJuridica.fechaNacimiento, 'DD/MM/YYYY') : '', [Validators.required]),
            pais: new FormControl(personaJuridica.pais || undefined, [Validators.required]),

            razonSocial: new FormControl(personaJuridica.razonSocial || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            nombreComercial: new FormControl(personaJuridica.nombreComercial || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            // web: new FormControl(personaJuridica.web || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            
            
            // primerNombre: new FormControl(personaJuridica.primerNombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            // segundoNombre: new FormControl(personaJuridica.segundoNombre || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS)]),
            // primerApellido: new FormControl(personaJuridica.primerApellido || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            // segundoApellido: new FormControl(personaJuridica.segundoApellido || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            // nacionalidad: new FormControl(personaJuridica.nacionalidad || undefined, [Validators.required]),
            // otraNacionalidad: new FormControl(personaJuridica.otraNacionalidad || undefined),
            // profesion: new FormControl(personaJuridica.profesion || undefined, [Validators.required]),
            // genero: new FormControl(personaJuridica.genero || undefined, [Validators.required]),
            // tenencia: new FormControl(personaJuridica.tenencia || undefined, [Validators.required]),
            // cargaFamiliar: new FormControl(personaJuridica.cargaFamiliar!=undefined ? personaJuridica.cargaFamiliar : '', [Validators.required]),
            // estadoCivil: new FormControl(personaJuridica.estadoCivil || undefined, [Validators.required]),
            actividadEconomica: new FormControl(personaJuridica.actividadEconomica || undefined, [Validators.required]),
            actividadEspecifica: new FormControl(personaJuridica.actividadEspecifica || undefined, [Validators.required]),
            categoriaEspecial: new FormControl(personaJuridica.categoriaEspecial || undefined),

            oficinas: new FormControl(personaJuridica.oficinas != undefined ? personaJuridica.oficinas : '', [Validators.required]),
            empleados: new FormControl(personaJuridica.empleados != undefined ? personaJuridica.empleados : '', [Validators.required]),
            ventas: new FormControl(this.personaJuridica.ventas || undefined ? personaJuridica.ventas : '', [Validators.required]),
            ingresos: new FormControl(this.personaJuridica.ingresos || undefined ? personaJuridica.ingresos : '', [Validators.required]),
            egresos: new FormControl(this.personaJuridica.egresos || undefined ? personaJuridica.egresos : '', [Validators.required]),

            anhoDeclaracion: new FormControl(personaJuridica.anhoDeclaracion != undefined ? personaJuridica.anhoDeclaracion : '', [Validators.required]),
            montoDeclarado: new FormControl(this.personaJuridica.montoDeclarado || undefined ? personaJuridica.montoDeclarado : '', [Validators.required]),
      
            

            // tipoDocumentoConyuge: new FormControl(personaJuridica.tipoDocumentoConyuge || undefined),
            // identificacionConyuge: new FormControl(personaJuridica.identificacionConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            // nombreConyuge: new FormControl(personaJuridica.nombreConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            // fuenteIngreso: new FormControl(personaJuridica.fuenteIngreso || undefined),
            email: new FormControl(personaJuridica.email || '', [Validators.required]),

            web: new FormControl(personaJuridica.web || '', [Validators.required])
        });

        // verifico si tengo datos basicos cargados
        // this.hasBasicData = this.personaNatural.id != undefined || this.personaNatural.numper != undefined;

        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_JURIDICA).subscribe(data => {
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

        // this.f.estadoCivil.valueChanges.subscribe(val => {
        //     if (val) {

        //         this.estado_civil = val;
        //         if (!this.evaluarEstadoCivil()) {
        //             // si esta evaluacion retorna false , es que no es casado, ni union estable
        //             this.addOrRemoveFieldValidator('tipoDocumentoConyuge', false)
        //             this.addOrRemoveFieldValidator('identificacionConyuge', false, '')
        //             this.addOrRemoveFieldValidator('nombreConyuge', false, '')
        //             this.addOrRemoveFieldValidator('fuenteIngreso', false)



        //             this.cdr.detectChanges();

        //         }
        //     }

        // })

    }


    addPerson(event) {
        console.log('create ', event);
        console.log('add new person');
        this.isNew = true;
        this.updateDataFromValues(this.personaJuridica, event);
        this.buildForm(this.personaJuridica);
        this.loaded$.next(true);
        // if(this.itemForm){
        //     this.f.tipoDocumento.setValue(this.personaNatural.tipoDocumento);
        //     this.f.identificacion.setValue(this.personaNatural.identificacion);
        // }

    }

    updatePerson(event) {
        console.log('update ', event);
        if(!event.id){
            return;
        }
        this.loaded$.next(false);

        this.loadingDataForm.next(true);
        this.isNew = false;
        console.log('current loaded ', this.loaded$.value);

        this.loaded$.next(false);
        this.loadingDataForm.next(true);
        this.personaJuridicaService.get(Number.parseInt(event.id)).subscribe(val => {
            this.personaJuridica = val;
            console.log('PERSONAAAA: ', val);
            //TODO: OJO REVISAR ESTO LUEGO
            // this.itemForm.reset({});
            this.buildForm(this.personaJuridica);
            this.loadingDataForm.next(false);
            this.loaded$.next(true);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });
        // this.router.navigate([`/sirio/persona/natural/${event.id}/edit`]);
    }

    queryResult(event) {
        console.log('event result ',event);
        
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

        // console.log(this.personaNatural);
        // this.personaJuridica.fechaNacimiento = this.personaJuridica.fechaNacimiento.format('DD/MM/YYYY');


        // this.saveOrUpdate(this.personaNaturalService, this.personaNatural, 'El Registro de Persona').subscribe(resp=>console.log(resp));

        if (this.isNew) {

            this.personaJuridicaService.save(this.personaJuridica).subscribe(data => {
                console.log(data);

                this.personaJuridica = data;
                this.successResponse('La persona', 'creada',true);
                this.hasBasicData = this.personaJuridica.id != undefined || this.personaJuridica.numper != undefined;


            }, error => this.errorResponse(true));

        } else {
            this.personaJuridicaService.update(this.personaJuridica).subscribe(data => {

                this.successResponse('La persona', 'actualizada',true);
            }, error => this.errorResponse(false));
        }

    }

    send() {

        console.log('send data al banco');
    }



    evaluarEstadoCivil(): boolean {
        return this.estado_civil == this.constants.CASADO || this.estado_civil == this.constants.UNION_ESTABLE;
    }


    updateAddress(event){
        this.totalAddress= event;
    }
    
    updateWorkingInfo(event){
        this.totalInfoLab= event;
    }
    
    updatePep(event){
        this.totalPep= event;
    }

    updateApoderado(event){
        console.log('apoderado', event);
        this.totalApoderado= event;
    }

    updateEmpresaRelacionada(event){
        console.log('peps', event);
        this.totalPep= event;
    }

    //openAddress() {
    openInformacionLaboral(opened:boolean) {
       
        this.showInformacionLaboral = opened;
        this.cdr.detectChanges();
    }

    openPep(opened:boolean) {
       
        this.showPep = opened;
        this.cdr.detectChanges();
    }
    
    openApoderado(opened:boolean) {
       
        this.showApoderado = opened;
        this.cdr.detectChanges();
    }
    
    openPhones(opened:boolean) {
       
        this.showPhone = opened;
        this.cdr.detectChanges();
    }

    openAddress(opened:boolean) {
        this.showAddress = opened;
        this.cdr.detectChanges();
    }

    openAccionistaDirectivo(opened:boolean) {
        this.showAccionistaDirectivo = opened;
        this.cdr.detectChanges();
    }

    openBankReference(opened:boolean) {
        this.showBankReference = opened;
        this.cdr.detectChanges();
    }

    openPersonalReference(opened:boolean) {
        this.showPersonalReference = opened;
        this.cdr.detectChanges();
    }

     
    openRegistroMercantil(opened:boolean) {
        this.showRegistroMercantil = opened;
        this.cdr.detectChanges();
        
    }

    openEmpresaRelacionada(opened:boolean) {
        
        this.showEmpresaRelacionada=opened; 
        this.cdr.detectChanges();
    }
}

