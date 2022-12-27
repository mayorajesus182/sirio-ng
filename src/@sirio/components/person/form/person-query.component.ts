import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
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
    @Input() title: string='Información del Cliente';
    @Input() taquilla: boolean = false;
    @Input() entity:  'interviniente'|'persona'|'cuenta'='persona';
    @Input() disabled: boolean = false;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
    @Output('create') create: EventEmitter<any> = new EventEmitter<any>();
    @Output('push') push: EventEmitter<any> = new EventEmitter<any>();
    // busqueda : boolean = false;
    tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    persona: Persona = {} as Persona;
    private legals = ['C',
        'G',
        'H',
        'I',
        'J',
        'R',
        'W'];

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
        private cdref: ChangeDetectorRef) {

    }


    ngAfterViewInit(): void {

        this.disable.subscribe(val => {
            if (val) {
                this.search.identificacion.disable();
                this.search.cuenta.disable();
                this.search.tipoDocumento.disable();
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
                this.tiposDocumentos.next(data);
            });
        } else {
            this.tipoDocumentoService.activesByTipoPersona(this.tipo_persona).subscribe(data => {
                this.tiposDocumentos.next(data);
            });

        }

        this.searchForm = this.fb.group({
            tipoDocumento: new FormControl(this.tipo_persona ? (this.tipo_persona == GlobalConstants.PERSONA_JURIDICA ? GlobalConstants.PJ_TIPO_DOC_DEFAULT : GlobalConstants.PN_TIPO_DOC_DEFAULT) : GlobalConstants.PN_TIPO_DOC_DEFAULT),
            identificacion: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl({ value: '', disabled: true }),
            cuenta: new FormControl('')
        });

        this.disableBtn.next(true);


        this.loading.subscribe(val=>{
            console.log('loading ', val);
            
            this.finding=val;
        })



    }

    get search(): AbstractControl | any {
        return this.searchForm ? this.searchForm.controls : {};
    }

    get isElemNew(){
        return this.isNew;
    }


    public queryByPerson() {

        if (this.search.identificacion.errors || this.finding) {
            return;
        }

        this.disableBtn.next(true);
        const tipoDocumento = this.search.tipoDocumento.value;
        const identificacion = this.search.identificacion.value;

        this.loading.next(true);

        if (tipoDocumento && identificacion) {

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
                
                this.disableBtn.next(false);
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

        this.cuentaBancariaService.activesByNumeroCuenta(cuenta).subscribe(data => {
          
            this.search.tipoDocumento.setValue(data.tipoDocumento);
            this.search.identificacion.setValue(data.identificacion);
            this.search.nombre.setValue(data.nombre);
            this.persona = { id: data.id, numper: data.numper } as Persona;
            data.numeroCuenta = cuenta;

            this.disable.next(true);
            this.disableBtn.next(false);
            
            this.cdref.detectChanges();
            this.result.emit(data);

        }, err => {
            this.search.cuenta.setErrors({ notexists: true });
            this.persona = {} as Persona;


            this.search.tipoDocumento.setValue('');
            this.search.identificacion.setValue('');
            this.search.nombre.setValue(' ');
            this.result.emit(this.persona);
            this.cdref.detectChanges();
        })

    }

    public onChangeFilter(event:any) {
        // console.log('%% on change filter %%', event);
        
        // this.persona = {} as Persona;
        // this.isNew = true;
        this.disableBtn.next(true);
        this.cdref.detectChanges();
        // this.result.emit({});
    }

    createOn() {
        this.create.emit(this.searchForm.value);
    }
 
    pushOn() {
        this.push.emit(this.persona);
    }


    editOn() {

        //TODO: DEBEMOS VERIFICAR SI EL CLIENTE TRAE LA FECHA DE ACTUALIZACION, EL TIEMPO SIN ACTUALIZAR QUE TIENE
        this.update.emit(this.persona);

    }

    resetAll() {
        this.searchForm.reset({});
        this.persona = {} as Persona;
        this.isNew = false;
        this.searchForm.controls['cuenta'].enable();
        this.searchForm.controls['identificacion'].enable();
        this.search.tipoDocumento.setValue(this.tipo_persona ? (this.tipo_persona == GlobalConstants.PERSONA_JURIDICA ? GlobalConstants.PJ_TIPO_DOC_DEFAULT : GlobalConstants.PN_TIPO_DOC_DEFAULT) : GlobalConstants.PN_TIPO_DOC_DEFAULT)
        this.cdref.detectChanges();
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
        if (this.search.tipoDocumento.value && !this.legals.includes(this.search.tipoDocumento.value)) {
            return true;
        } else if (this.tipo_persona) {

            return this.tipo_persona == GlobalConstants.PERSONA_NATURAL;
        }


    }

    isLegalPerson() {
        // console.log('tipo doc selected', this.search.tipoDocumento.value);
        // console.log('tipo persona input', this.tipo_persona);

        if (this.search.tipoDocumento.value && this.legals.includes(this.search.tipoDocumento.value)
        ) {

            return true;
        } else if (this.tipo_persona) {

            return this.tipo_persona == GlobalConstants.PERSONA_JURIDICA;
        }

    }

}
