import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from 'rxjs';
import { fadeInRightAnimation } from "src/@sirio/animations/fade-in-right.animation";
import { fadeInUpAnimation } from "src/@sirio/animations/fade-in-up.animation";
import { GlobalConstants, RegularExpConstants } from "src/@sirio/constants";
import { TipoDocumento, TipoDocumentoService } from "src/@sirio/domain/services/configuracion/tipo-documento.service";
import { CuentaBancariaService } from "src/@sirio/domain/services/cuenta-bancaria.service";
import { Persona, PersonaService } from "src/@sirio/domain/services/persona/persona.service";





@Component({
    selector: 'sirio-person-query',
    templateUrl: './person-query.component.html',
    styleUrls: ['./person-query.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})
export class PersonQueryComponent implements OnInit, AfterViewInit {
    searchForm: FormGroup;
    isNew: boolean = false;
    @Input() tooltips: string = 'Crear';
    @Input() tipo_persona: string;
    @Input() title: string = 'Información del Cliente';
    @Input() taquilla: boolean = false;
    @Input() entity: 'interviniente' | 'persona' | 'gestioncomercial' | 'cuenta' = 'persona';
    @Input() disabled: boolean = false;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
    @Output('create') create: EventEmitter<any> = new EventEmitter<any>();
    @Output('push') push: EventEmitter<any> = new EventEmitter<any>();
    // busqueda : boolean = false;
    tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    tiposDocumentoList: TipoDocumento[] = [];
    persona: Persona = {} as Persona;
    // private legals:string[] = [];
    // ['C',
    //     'G',
    //     'H',
    //     'I',
    //     'J',
    //     'R',
    //     'W'];

    private loading = new BehaviorSubject<boolean>(false);
    private finding = false;
    disable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    disableBtn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


    private _onDestroy = new Subject<void>();

    constructor(private dialog: MatDialog,
        private fb: FormBuilder,
        private tipoDocumentoService: TipoDocumentoService,
        private cuentaBancariaService: CuentaBancariaService,
        private personaService: PersonaService,
        private router: Router,
        private cdref: ChangeDetectorRef) {

    }


    ngAfterViewInit(): void {

        this.disable.subscribe(val => {
            if (val) {
                this.searchForm.controls.identificacion.disable();
                this.searchForm.controls.cuenta.disable();
                this.searchForm.controls.tipoDocumento.disable();
            }
        })

        this.search.identificacion.valueChanges.subscribe(val => {
            if (val && !this.search.cuenta.disabled) {
                this.search.cuenta.disable();
            }

            // console.log('rif change ', val);
            // console.log('rif errors ', this.search.identificacion.errors);
            // console.log('rif errors ', this.search.identificacion.errors.length);

            if (val && this.search.identificacion.errors) {
                // this.resetAll();
                this.persona = {} as Persona;
                this.isNew = false;
                this.finding = false;
                this.cdref.detectChanges();
            }
        })

        this.search.cuenta.valueChanges.subscribe(val => {
            if (val && !this.search.identificacion.disabled) {
                this.search.identificacion.disable();
            }
        })


    }

    ngOnInit(): void {

        if (!this.tipo_persona) {
            this.tipoDocumentoService.actives().subscribe(data => {
                
                this.tiposDocumentoList = data;
                this.tiposDocumentos.next(data);
            });
        } else {
            this.tipoDocumentoService.activesByTipoPersona(this.tipo_persona).subscribe(data => {
                console.log(data);
                
                this.tiposDocumentoList = data;

                this.tiposDocumentos.next(data);
            });

        }

        // this.tipoDocumentoService.activesJuridicos().subscribe(data=>this.legals=data.map(t=>t.id));

        this.searchForm = this.fb.group({
            tipoDocumento: new FormControl(this.tipo_persona ? (this.tipo_persona == GlobalConstants.PERSONA_JURIDICA ? GlobalConstants.PJ_TIPO_DOC_DEFAULT : GlobalConstants.PN_TIPO_DOC_DEFAULT) : GlobalConstants.PN_TIPO_DOC_DEFAULT),
            identificacion: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl({ value: '', disabled: true }),
            cuenta: new FormControl(''),
            tipoPersona: new FormControl('')
        });

        // this.searchForm.markAllAsTouched();

        this.disableBtn.next(true);


        this.loading.subscribe(val => {
            // console.log('loading ', val);

            this.finding = val;
        })



    }

    get search(): AbstractControl | any {
        return this.searchForm ? this.searchForm.controls : {};
    }

    get isElemNew() {
        return this.isNew;
    }


    public queryByPerson() {


        if (this.search.identificacion.errors || this.finding) {
            return;
        }

        this.disableBtn.next(true);
        const tipoDocumento = this.search.tipoDocumento.value;
        const identificacion = this.search.identificacion.value;

        console.log(this.searchForm.value);


        if (tipoDocumento && identificacion) {
            this.loading.next(true);

            this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                this.persona = data;
                this.search.nombre.setValue(data.nombre);
                this.loading.next(false);
                this.isNew = false;
                if (this.result) {
                    this.persona.identificacion = identificacion;
                    this.result.emit(this.persona);
                }


                this.search.identificacion.setErrors(null);
                this.search.cuenta.setValue('');
                // this.searchForm.controls['identificacion'].disable();
                // this.searchForm.controls['cuenta'].disable();
                // this.searchForm.controls['tipoDocumento'].disable();
                this.disable.next(true);
                this.disableBtn.next(false);
                this.finding = false;
                this.cdref.detectChanges();

            }, err => {

                this.persona = {} as Persona;
                this.isNew = true;
                this.loading.next(false);
                if (this.result) {
                    this.result.emit(this.persona);
                }
                this.disableBtn.next(false);
                this.search.identificacion.setErrors({ notexists: true });
                this.search.nombre.setValue(' ');
                this.search.cuenta.setValue('');
                this.finding = false;
                this.disableBtn.next(false);

                console.log(this.searchForm.value);
                
                this.cdref.detectChanges();
            })
        } else if (!tipoDocumento) {

            // this.search.tipoDocumento.setErrors({required:true});
            this.searchForm.controls['identificacion'].setErrors({ requiredTipoDoc: true });
            this.searchForm.controls['identificacion'].markAsDirty();
            this.cdref.detectChanges();
        }
    }

    public queryByAccount() {
        const cuenta: string = this.search.cuenta.value;



        if (cuenta.trim().length != 20 || this.search.cuenta.errors) {
            // this.busqueda = false;
            return;
        }

        // this.busqueda = true;
        this.loading.next(true);
        this.cuentaBancariaService.activesByNumeroCuenta(cuenta).subscribe(data => {

            this.search.tipoDocumento.setValue(data.tipoDocumento);
            this.search.identificacion.setValue(data.identificacion);
            this.search.tipoPersona.setValue(this.tiposDocumentoList.filter(t => t.id == data.tipoDocumento).map(t => t.tipoPersona).reduce((a, b) => a, '') || ' ');
            this.search.nombre.setValue(data.nombre);
            this.persona = { id: data.id, numper: data.numper } as Persona;
            data.numeroCuenta = cuenta;

            this.disable.next(true);
            this.disableBtn.next(false);
            this.loading.next(false);
            this.cdref.detectChanges();
            this.result.emit(data);

        }, err => {
            this.loading.next(false);
            this.search.cuenta.setErrors({ notexists: true });
            this.persona = {} as Persona;


            this.search.tipoDocumento.setValue('');
            this.search.identificacion.setValue('');
            this.search.nombre.setValue(' ');
            this.search.tipoPersona.setValue(' ');
            this.result.emit(this.persona);
            this.cdref.detectChanges();
        })

    }

    public onChangeFilter(event: any) {
        // console.log('%% on change filter %%', event);

        // this.persona = {} as Persona;
        // this.isNew = true;
        this.cdref.detectChanges();
        this.disableBtn.next(true);
        // this.result.emit({});
    }

    createOn() {
        // console.log(this.searchForm.value);
        this.search.tipoPersona.setValue(this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value).map(t => t.tipoPersona).reduce(a => a) || '');
        this.create.emit(this.searchForm.value);
        this.disable.next(true);
    }

    pushOn() {
        // this.disable.next(true);
        if (!this.persona.id && !this.persona.numper) {
            this.persona = this.searchForm.value;
        }

        // console.log(this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value));
        // console.log(this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value).map(t => t.tipoPersona));
        // console.log(this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value).map(t => t.tipoPersona).reduce(a=>a));


        this.persona.tipoPersona = this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value).map(t => t.tipoPersona).reduce(a => a) || '';

        // console.log(this.persona);
        this.push.emit(this.persona);
        this.resetAll();
    }


    editOn() {

        //TODO: DEBEMOS VERIFICAR SI EL CLIENTE TRAE LA FECHA DE ACTUALIZACION, EL TIEMPO SIN ACTUALIZAR QUE TIENE
        this.update.emit(this.persona);

        this.disable.next(true);

    }

    resetAll() {
        this.searchForm.reset({});
        this.persona = {} as Persona;
        this.isNew = false;
        this.searchForm.controls['cuenta'].enable();
        this.searchForm.controls['identificacion'].enable();
        this.disableBtn.next(true);
        this.search.tipoDocumento.setValue(this.tipo_persona ? (this.tipo_persona == GlobalConstants.PERSONA_JURIDICA ? GlobalConstants.PJ_TIPO_DOC_DEFAULT : GlobalConstants.PN_TIPO_DOC_DEFAULT) : GlobalConstants.PN_TIPO_DOC_DEFAULT)
        this.cdref.detectChanges();
        this.finding = false;
        this.result.emit({});
    }

    private showPopup(popupComponent, data: any, withDialog = '60%'): MatDialogRef<any> {
        let data_aux = { payload: undefined, isNew: undefined };

        data_aux.payload = data;

        return this.dialog.open(popupComponent, {
            panelClass: 'dialog-frame',
            width: withDialog,
            disableClose: true,
            data: data_aux
        });
    }

    isDisabled() {
        return this.persona.numper != undefined || this.persona.numper != null || this.search.cuenta.value != undefined;
    }


    isNaturalPerson() {
        if (this.search.tipoDocumento.value && !this.isLegalPerson()) {
            return true;
        } else if (this.tipo_persona) {

            return this.tipo_persona == GlobalConstants.PERSONA_NATURAL;
        }

        return false;
    }

    isLegalPerson() {
        // if(!this.search.tipoDocumento.value){
        //    return; 
        // }
        // console.log('tipo doc ', this.tiposDocumentoList);
        // console.log('tipo persona ', this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value));
        // const= this.tiposDocumentos.
        let isLegal = this.tiposDocumentoList.filter(t => t.id == this.search.tipoDocumento.value).map(t => t.tipoPersona).includes(GlobalConstants.PERSONA_JURIDICA);
        // console.log('tipo doc selected', this.search.tipoDocumento.value, isLegal);


        if (this.search.tipoDocumento.value && isLegal) {

            return true;
        } else if (this.tipo_persona) {

            return this.tipo_persona == GlobalConstants.PERSONA_JURIDICA;
        }

        return false;

    }

}
