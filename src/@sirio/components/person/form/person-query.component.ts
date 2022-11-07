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
    @Input() taquilla: boolean = false;
    @Input() disabled: boolean = false;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
    @Output('create') create: EventEmitter<any> = new EventEmitter<any>();

    tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    persona: Persona = {} as Persona;

    private loading = new BehaviorSubject<boolean>(false);


    private _onDestroy = new Subject<void>();

    constructor(private dialog: MatDialog,
        private fb: FormBuilder,
        private tipoDocumentoService: TipoDocumentoService,
        private cuentaBancariaService: CuentaBancariaService,
        private personaService: PersonaService,
        private cdref: ChangeDetectorRef) {

    }


    ngAfterViewInit(): void {

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


        this.search.identificacion.valueChanges.subscribe(val => {

            if (val && val.trim().length > 0 && !this.searchForm.controls['cuenta'].disabled) {

                this.searchForm.controls['cuenta'].disable();
            } else if ((!val || val.trim().length == 0) && this.searchForm.controls['cuenta'].disabled) {
                this.searchForm.controls['cuenta'].enable();

            }
            // this.cdref.detectChanges();
        })


        this.search.cuenta.valueChanges.subscribe(val => {
            if (val && val.trim().length > 0 && !this.searchForm.controls['identificacion'].disabled) {
                this.searchForm.controls['identificacion'].disable();
                // this.searchForm.controls['tipoDocumento'].disable();                
            } else if ((!val || val.trim().length == 0) && this.searchForm.controls['identificacion'].disabled) {
                this.searchForm.controls['identificacion'].enable();
                // this.searchForm.controls['tipoDocumento'].enable();                

            }
        });

        this.cdref.markForCheck();

    }

    get search(): AbstractControl | any {
        return this.searchForm ? this.searchForm.controls : {};
    }


    public queryByPerson() {

        // console.log(this.search.identificacion.errors);        

        if (this.search.identificacion.errors) {
            return;
        }

        const tipoDocumento = this.search.tipoDocumento.value;
        const identificacion = this.search.identificacion.value;

        this.loading.next(true);

        if (tipoDocumento && identificacion) {

            this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                // console.log("result query:", data);
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
                this.cdref.detectChanges();

            }, err => {

                this.persona = {} as Persona;
                this.isNew = true;
                this.loading.next(false);
                if (this.result) {
                    this.result.emit(this.persona);
                }
                this.search.identificacion.setErrors({ notexists: true });
                this.search.nombre.setValue(' ');
                this.search.cuenta.setValue('');

                this.cdref.detectChanges();
            })
        } else if (!tipoDocumento) {

            // this.search.tipoDocumento.setErrors({required:true});
            this.searchForm.controls['identificacion'].setErrors({ requiredTipoDoc: true });
            this.searchForm.controls['identificacion'].markAsDirty();
            // console.log('errors ', this.search.identificacion.errors);
            this.cdref.detectChanges();
        }
    }

    public queryByAccount() {
        const cuenta: string = this.search.cuenta.value;


        if (cuenta.trim().length == 0 || this.search.cuenta.errors) {
            return;
        }

        this.cuentaBancariaService.activesByNumeroCuenta(cuenta).subscribe(data => {
            // this.cuentaBancariaOperacion = data;
            //const moneda = data.moneda;
            // const monedaNombre = data.monedaNombre;
            /*
            identificacion:"123"
             moneda:"928"
             monedaNombre:"BOLÍVAR SOBERANO"
             nombre:"Johander Javier Salcedo Delgado"
             numper:"0198"
             persona:1
             tipoDocumento:"V" 
            this.moneda.id = data.moneda;
             this.moneda.nombre = data.monedaNombre;*/
            //this.f.monto.disable();
            this.search.tipoDocumento.setValue(data.tipoDocumento);
            this.search.identificacion.setValue(data.identificacion);
            this.search.nombre.setValue(data.nombre);
            this.persona = { id: data.id, numper: data.numper } as Persona;
            data.numeroCuenta = cuenta;


            // console.log("resultado consulta by cuenta", data);
            this.result.emit(data);

        }, err => {
            //console.log(err);
            this.search.cuenta.setErrors({ notexists: true });
            this.persona = {} as Persona;

            this.cdref.detectChanges();

            this.search.tipoDocumento.setValue('');
            this.search.identificacion.setValue('');
            this.search.nombre.setValue(' ');
            this.result.emit(this.persona);
        })

    }

    add() {
        // console.log('crear persona ', this.searchForm.value);

        this.create.emit(this.searchForm.value);
    }


    edit() {
        // console.log('editar persona ', this.searchForm.value);

        this.update.emit(this.persona);

    }

    resetAll() {
        this.searchForm.reset({});
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


}
