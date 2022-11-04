import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ConoMonetario } from "src/@sirio/domain/services/configuracion/divisa/cono-monetario.service";
import { Moneda } from "src/@sirio/domain/services/configuracion/divisa/moneda.service";
import { CashFormPopupComponent } from "../popup/cash-form.popup.component";




@Component({
    selector: 'sirio-cash-button',
    templateUrl: './cash-button.component.html',
    styleUrls: ['./cash-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CashButtonComponent implements OnInit, AfterViewInit {

    @Input() tooltips: string = 'Desglosar Efectivo';
    @Input() moneda: Moneda;
    @Input() total: number;
    @Input() operation: 'deposito'|'retiro'='deposito';

    @Input() disabled: boolean = false;


    @Input('cono_actual') cono_actual: ConoMonetario[] = [];
    @Input('cono_anterior') cono_anterior: ConoMonetario[] = [];

    @Output('update') update = new EventEmitter<any>();


    private _onDestroy = new Subject<void>();

    constructor(private dialog: MatDialog, private cdref: ChangeDetectorRef) {


    }


    ngAfterViewInit(): void {


        this.cdref.detectChanges();
    }

    ngOnInit(): void {

        console.log('operartion ',this.operation);
        

    }

    open() {

        this.showPopup(CashFormPopupComponent, {
            desgloseConoActual: this.cono_actual,
            desgloseConoAnterior: this.cono_anterior, 
            moneda: this.moneda,
            total:this.total
        }, '40%').afterClosed().subscribe(e => {
            console.log('close dialog ', e);
            if(e){
                this.update.emit(e);
            }
        });
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
