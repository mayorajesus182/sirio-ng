import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from 'rxjs';
import { TipoDocumento, TipoDocumentoService } from "src/@sirio/domain/services/configuracion/tipo-documento.service";
import { Persona } from "src/@sirio/domain/services/persona/persona.service";





@Component({
    selector: 'sirio-person-query',
    templateUrl: './person-query.component.html',
    styleUrls: ['./person-query.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PersonQueryComponent implements OnInit, AfterViewInit {
    searchForm: FormGroup;
    isNew:boolean=true;
    @Input() tooltips: string = 'Crear';
    @Input() tipo_persona: string;

    @Input() disabled: boolean = false;

    @Output('update') update = new EventEmitter<any>();

    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    persona:Persona={} as Persona;


    private _onDestroy = new Subject<void>();

    constructor(private dialog: MatDialog,
        private tipoDocumentoService: TipoDocumentoService,
        private cdref: ChangeDetectorRef) {

    }


    ngAfterViewInit(): void {


        this.cdref.detectChanges();
    }

    ngOnInit(): void {

        this.tipoDocumentoService.activesByTipoPersona(this.tipo_persona).subscribe(data => {
            this.tipoDocumentos.next(data);
        });

        //             this.update.emit(e);
    }

    get search() {
        return this.searchForm ? this.searchForm.controls : {};
    }

    add(){

    }

    edit(){

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
