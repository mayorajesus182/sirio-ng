import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable, Subject } from 'rxjs';




@Component({
    selector: 'sirio-cash-detail',
    templateUrl: './cash-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CashDetailComponent implements OnInit, AfterViewInit {

    @Input() label: string;
    @Input() attributeName: string;
    @Input() readonly: boolean = false;
    @Input('conoMonetario') public cono: Observable<any[]>;
    public disabled: boolean = false;
    
    private _onDestroy = new Subject<void>();

    constructor(private host: ElementRef<HTMLInputElement>) {


    }
    ngAfterViewInit(): void {
       



    }
    ngOnInit(): void {


    }


}
