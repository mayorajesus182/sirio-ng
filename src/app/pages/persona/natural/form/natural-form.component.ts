import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { PersonaNatural, PersonaNaturalService } from 'src/@sirio/domain/services/persona/persona-natural.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Genero, GeneroService } from 'src/@sirio/domain/services/configuracion/persona-natural/genero.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { EstadoCivil, EstadoCivilService } from 'src/@sirio/domain/services/configuracion/persona-natural/estado-civil.service';
import { Profesion, ProfesionService } from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import { Tenencia, TenenciaService } from 'src/@sirio/domain/services/configuracion/domicilio/tenencia.service';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';

@Component({
    selector: 'app-natural-form',
    templateUrl: './natural-form.component.html',
    styleUrls: ['./natural-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NaturalFormComponent extends FormBaseComponent implements OnInit {

    hasBasicData = true;
    nombreCompletoPersona = 'NOMBRE COMPLETO DE LA PERSONA';
    personaNatural: PersonaNatural = {} as PersonaNatural;
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    generos = new BehaviorSubject<Genero[]>([]);
    paises = new BehaviorSubject<Pais[]>([]);
    estadosCiviles = new BehaviorSubject<EstadoCivil[]>([]);
    profesiones = new BehaviorSubject<Profesion[]>([]);
    tenencias = new BehaviorSubject<Tenencia[]>([]);
    actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private personaNaturalService: PersonaNaturalService,
        private tipoDocumentoService: TipoDocumentoService,
        private paisService: PaisService,
        private estadoCivilService: EstadoCivilService,
        private generoService: GeneroService,
        private profesionService: ProfesionService,
        private tenenciaService: TenenciaService,
        private actividadEconomicaService: ActividadEconomicaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);//TODO: CON ESTO, LUEGO DEBEMOS MANEJAR LOS EVENTOS DE CARGA DE DATA

        this.buildForm(this.personaNatural);
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

        // let id = this.route.snapshot.params['id'];
        // this.isNew = id == undefined;
        // this.loadingDataForm.next(true);

        // if (id) {
        //     this.personaNaturalService.get(id).subscribe((agn: Persona) => {
        //         this.persona = agn;
        //         this.buildForm(this.persona);
        //         this.cdr.markForCheck();
        //         this.loadingDataForm.next(false);
        //         this.cdr.detectChanges();
        //     });
        // } else {
        //     this.buildForm(this.persona);
        //     this.loadingDataForm.next(false);
        // }

        // if (!id) {
        //     this.f.id.valueChanges.subscribe(value => {
        //         if (!this.f.id.errors && this.f.id.value.length > 0) {
        //             this.codigoExists(value);
        //         }
        //     });
        // }
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
            tipoDocumentoConyuge: new FormControl(personaNatural.tipoDocumentoConyuge || undefined),
            identificacionConyuge: new FormControl(personaNatural.identificacionConyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            conyuge: new FormControl(personaNatural.conyuge || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            fuenteIngreso: new FormControl(personaNatural.fuenteIngreso || undefined),
            email: new FormControl(personaNatural.email || '', [Validators.required]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.personaNatural);
        this.saveOrUpdate(this.personaNaturalService, this.personaNatural, 'El Registro de Persona', this.isNew);
    }

    send() {
        
        console.log('send data al banco');
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
