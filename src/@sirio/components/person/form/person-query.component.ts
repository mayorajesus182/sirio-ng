import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from 'rxjs';
import { fadeInRightAnimation } from "src/@sirio/animations/fade-in-right.animation";
import { fadeInUpAnimation } from "src/@sirio/animations/fade-in-up.animation";
import { RegularExpConstants } from "src/@sirio/constants";
import { TipoDocumento, TipoDocumentoService } from "src/@sirio/domain/services/configuracion/tipo-documento.service";
import { CuentaBancariaService } from "src/@sirio/domain/services/cuenta-bancaria.service";
import { Persona, PersonaService } from "src/@sirio/domain/services/persona/persona.service";





@Component({
    selector: 'sirio-person-query[tipo_persona]',
    templateUrl: './person-query.component.html',
    styleUrls: ['./person-query.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})
export class PersonQueryComponent implements OnInit, AfterViewInit {
    searchForm: FormGroup;
    isNew: boolean = true;
    @Input() tooltips: string = 'Crear';
    @Input() tipo_persona: string;
    @Input() taquilla: boolean = false;
    @Input() disabled: boolean = false;
    @Output('result') result:EventEmitter<any> = new EventEmitter<any>();
    @Output('update') update:EventEmitter<any> = new EventEmitter<any>();
    @Output('create') create:EventEmitter<any> = new EventEmitter<any>();

    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
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

        this.cdref.detectChanges();
    }

    ngOnInit(): void {

        this.tipoDocumentoService.activesByTipoPersona(this.tipo_persona).subscribe(data => {
            this.tipoDocumentos.next(data);
        });

        this.searchForm = this.fb.group({
            tipoDocumento: new FormControl(undefined),
            identificacion: new FormControl('', [Validators.pattern(RegularExpConstants.NUMERIC)]),
            nombre: new FormControl(''),
            account: new FormControl('')
        });


    }

    get search() {
        return this.searchForm ? this.searchForm.controls : {};
    }


    public queryByPerson() {
        const tipoDocumento = this.search.tipoDocumento.value;
        const identificacion = this.search.identificacion.value;

        this.loading.next(true);

        if (tipoDocumento && identificacion) {
            this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
                // console.log("result query:", data);
                this.persona = data;
                this.search.nombre.setValue(data.nombre);
                this.loading.next(false);
                if(this.result){

                    this.result.emit(this.persona);
                }
                this.cdref.detectChanges();

            }, err => {

                this.persona = {} as Persona;
                this.loading.next(false);
                if(this.result){
                    this.result.emit(this.persona);
                }
                this.search.identificacion.setErrors({ notexists: true });

                this.cdref.detectChanges();
            })
        }else if(!tipoDocumento){
            console.log('error');
        
            this.search.tipoDocumento.setErrors({required:true});
            this.cdref.detectChanges();
        }
    }

    public queryByAccount() {

    }

    add() {
        // console.log('crear persona ', this.searchForm.value);

        this.create.emit(this.searchForm.value);
    }


    edit() {
        // console.log('editar persona ', this.searchForm.value);

        this.update.emit(this.persona);

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
