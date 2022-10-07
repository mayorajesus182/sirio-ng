import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { ConoMonetario, ConoMonetarioService } from "src/@sirio/domain/services/configuracion/divisa/cono-monetario.service";




@Component({
    selector: 'sirio-cash-detail',
    templateUrl: './cash-detail.component.html',
    styleUrls: ['./cash-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CashDetailComponent implements OnInit, AfterViewInit {

    @Input() label: string;
    @Input() width_column:string;
    @Input() readonly: boolean = false;
    @Input('cono_actual') public conoActual: Observable<ConoMonetario[]>;
    @Input('cono_anterior') public conoAnterior: Observable<ConoMonetario[]>;
    public disabled: boolean = false;
    private detail:ConoMonetario[];
    
    private _onDestroy = new Subject<void>();

    constructor(private host: ElementRef<HTMLInputElement>) {


    }


    ngAfterViewInit(): void {
       

    }
    ngOnInit(): void {


        this.conoActual.subscribe(data=>console.log('cono actual',data));
        this.conoAnterior.subscribe(data=>console.log('cono anterior',data));

    }


}
