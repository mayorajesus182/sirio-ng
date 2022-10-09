import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { ReplaySubject, Subject } from 'rxjs';
import { ConoMonetario, ConoMonetarioService } from "src/@sirio/domain/services/configuracion/divisa/cono-monetario.service";
import { PreferenciaService } from "src/@sirio/domain/services/preferencias/preferencia.service";
import { SweetAlertService } from "src/@sirio/services/swal.service";




@Component({
    selector: 'sirio-cash-detail',
    templateUrl: './cash-detail.component.html',
    styleUrls: ['./cash-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CashDetailComponent implements OnInit, AfterViewInit {

    @Input() label: string;
    @Input() labelPrefix: string;
    @Input() total: number;
    public label_cono_actual: string = 'VES';
    public label_cono_anterior: string = 'VES';
    @Input() width_column: string = '24';
    @Input() readonly: boolean = false;
    @Input() cono_actual: ConoMonetario[]=[];
    @Input() cono_anterior: ConoMonetario[]=[];
    
    @Output('cono_actual_update') conoActual= new EventEmitter<ConoMonetario[]>();
    @Output('cono_anterior_update') conoAnterior= new EventEmitter<ConoMonetario[]>();
    public disabled: boolean = false;
    public listConoActual: ReplaySubject<any[]> = new ReplaySubject<any[]>(0);
    public listConoAnterior: ReplaySubject<any[]> = new ReplaySubject<any[]>(0);

    private listActual:ConoMonetario[]=[];
    private listAnterior:ConoMonetario[]=[];

    private _onDestroy = new Subject<void>();

    constructor(private host: ElementRef<HTMLInputElement>,
        private preferenciaService: PreferenciaService,
        private conoService: ConoMonetarioService,
        private swalService: SweetAlertService,
        private cdref: ChangeDetectorRef) {


    }


    ngAfterViewInit(): void {


    }

    ngOnInit(): void {

        this.preferenciaService.get().subscribe(data => {

            if (data && data.monedaConoActual ) {
                this.label_cono_actual=data.monedaConoActual;
                this.label_cono_anterior=data.monedaConoAnterior || '';
                this.conoService.activesByMoneda(data.monedaConoActual).subscribe(data => {
                    this.listConoActual.next(data.slice());
                });
                this.conoService.activesByMoneda(data.monedaConoAnterior).subscribe(data => {
                    this.listConoAnterior.next(data.slice());
                });
                
            } else {                
                this.listConoActual.next([]);
                this.listConoAnterior.next([]);
                this.swalService.show('Preference Not Found');
            }
            this.cdref.detectChanges();
        })


    }

    onChangeConoActual(elem:ConoMonetario){
        const ix = this.listActual.findIndex(e=>e.denominacion == elem.denominacion);
        console.log('index ',ix);
        
        if(elem.count <= 0 || !elem.count){
            if(ix >=0){
                this.listActual.splice(ix,1);
                console.log('remove ',this.listActual);
                this.conoActual.emit(this.listActual.slice());
            }
            
        }else{
            if(ix >=0){
                this.listActual[ix].count= elem.count;
            }else{
                this.listActual.push(elem);
            }
            // console.log('push',this.listActual);
            this.conoActual.emit(this.listActual.slice());
        }
    }


}
