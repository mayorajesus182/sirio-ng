import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ConoMonetario } from "src/@sirio/domain/services/configuracion/divisa/cono-monetario.service";




@Component({
    selector: 'sirio-cash-detail',
    templateUrl: './cash-detail.component.html',
    styleUrls: ['./cash-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CashDetailComponent implements OnInit, AfterViewInit {

    @Input() label: string;
    @Input() label_cono_actual: string = 'VES';
    @Input() label_cono_anterior: string = 'VES';
    @Input() width_column: string = '24';
    @Input() readonly: boolean = false;
    @Input('cono_actual') public conoActual: Observable<ConoMonetario[]>;
    @Input('cono_anterior') public conoAnterior: Observable<ConoMonetario[]>;
    public disabled: boolean = false;
    public listActual: ReplaySubject<any[]> = new ReplaySubject<any[]>(0);
    public listAnterior: ReplaySubject<any[]> = new ReplaySubject<any[]>(0);

    private _onDestroy = new Subject<void>();

    constructor(private host: ElementRef<HTMLInputElement>, private cdref: ChangeDetectorRef) {


    }


    ngAfterViewInit(): void {

        this.conoActual.subscribe(data => {

            console.log('** cono actual', data)
            this.listActual.next(data.slice());
            
            
        });
        
        if (this.conoAnterior) {
            
            this.conoAnterior.subscribe(data => {
                console.log('** cono anterior', data)
                this.listAnterior.next(data.slice());
                // this.cdref.detectChanges();
                
            });
        }
        this.cdref.detectChanges();
        
    }

    ngOnInit(): void {

        this.listActual.next([].slice());
        this.listAnterior.next([].slice());
    }


}
