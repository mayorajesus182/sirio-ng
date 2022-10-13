import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ConoMonetario, ConoMonetarioService } from "src/@sirio/domain/services/configuracion/divisa/cono-monetario.service";
import { Preferencia, PreferenciaService } from "src/@sirio/domain/services/preferencias/preferencia.service";
import { SweetAlertService } from "src/@sirio/services/swal.service";




@Component({
    selector: 'sirio-cash-detail',
    templateUrl: './cash-detail.form.component.html',
    styleUrls: ['./cash-detail.form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CashDetailComponent implements OnInit, AfterViewInit {

    @Input() label: string;
    @Input() labelPrefix: string;
    @Input() total: number;
    @Input() moneda: string;
    public label_cono_actual: string = 'VES';
    public label_cono_anterior: string = 'VES';
    @Input() width_column: string = '24';
    @Input() readonly: boolean = false;
    @Input() cono_actual: ConoMonetario[]=[];
    @Input() cono_anterior: ConoMonetario[]=[];
    @Input() preferencia: BehaviorSubject<Preferencia> = new BehaviorSubject<Preferencia>(undefined);
    
    @Output('cono_actual_update') conoActual= new EventEmitter<ConoMonetario[]>();
    @Output('cono_anterior_update') conoAnterior= new EventEmitter<ConoMonetario[]>();
    public disabled: boolean = false;
    public listConoActual: ReplaySubject<ConoMonetario[]> = new ReplaySubject<ConoMonetario[]>(0);
    public listConoAnterior: ReplaySubject<ConoMonetario[]> = new ReplaySubject<ConoMonetario[]>(0);

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

        this.preferencia.subscribe(data => {
            if(!data){
                return;
            }

            if (data.monedaConoActual ) {
                this.label_cono_actual=this.moneda==data.monedaConoActual?data.monedaConoActual:this.moneda;
                this.label_cono_anterior=data.monedaConoAnterior || '';
                this.conoService.activesByMoneda(this.label_cono_actual).subscribe(data => {

                    if(this.cono_actual){
                        data.map(c=>{
                            let index = this.cono_actual.findIndex(ca=>ca.id==c.id);
                            if(index >=0){

                                c.count= this.cono_actual[index].count;
                            }
                            return c;
                        })
                    }
                    this.listConoActual.next(data.slice());
                });
                if(this.moneda==data.monedaConoActual){

                    this.conoService.activesByMoneda(data.monedaConoAnterior).subscribe(data => {
    
    
                        if(this.cono_anterior){
                            data.map(c=>{
                                let index = this.cono_anterior.findIndex(ca=>ca.id==c.id);
                                if(index >=0){
    
                                    c.count= this.cono_anterior[index].count;
                                }
                                return c;
                            })
                        }
    
                        this.listConoAnterior.next(data.slice());
                    });
                }
                
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
        // console.log('index ',ix);
        
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

    onChangeConoAnterior(elem:ConoMonetario){
        const ix = this.listAnterior.findIndex(e=>e.denominacion == elem.denominacion);
        // console.log('index ',ix);
        
        if(elem.count <= 0 || !elem.count){
            if(ix >=0){
                this.listAnterior.splice(ix,1);
                console.log('remove ',this.listAnterior);
                this.conoActual.emit(this.listAnterior.slice());
            }
            
        }else{
            if(ix >=0){
                this.listAnterior[ix].count= elem.count;
            }else{
                this.listAnterior.push(elem);
            }
            // console.log('push',this.listActual);
            this.conoActual.emit(this.listAnterior.slice());
        }
    }


}
