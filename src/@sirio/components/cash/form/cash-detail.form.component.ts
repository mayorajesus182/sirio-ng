import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ConoMonetario, ConoMonetarioService } from "src/@sirio/domain/services/configuracion/divisa/cono-monetario.service";
import { Moneda } from "src/@sirio/domain/services/configuracion/divisa/moneda.service";
import { SaldoTaquillaService } from "src/@sirio/domain/services/control-efectivo/saldo-taquilla.service";
import { Preferencia } from "src/@sirio/domain/services/preferencias/preferencia.service";
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
    @Input() moneda: Moneda;
    public label_cono_actual: string = 'VES';
    public label_cono_anterior: string = 'VES';
    @Input() width_column: string = '24';
    @Input() readonly: boolean = false;
    @Input() operation: 'retiro' | 'deposito' = 'deposito';
    @Input() cono_actual: ConoMonetario[] = [];
    @Input() cono_anterior: ConoMonetario[] = [];
    @Input() preferencia: BehaviorSubject<Preferencia> = new BehaviorSubject<Preferencia>(undefined);

    @Output('cono_actual_update') conoActual = new EventEmitter<ConoMonetario[]>();
    @Output('cono_anterior_update') conoAnterior = new EventEmitter<ConoMonetario[]>();
    public disabled: boolean = false;
    public listConoActual: ReplaySubject<ConoMonetario[]> = new ReplaySubject<ConoMonetario[]>(0);
    public listConoAnterior: ReplaySubject<ConoMonetario[]> = new ReplaySubject<ConoMonetario[]>(0);

    private listActual: ConoMonetario[] = [];
    private listAnterior: ConoMonetario[] = [];

    private _onDestroy = new Subject<void>();

    constructor(private host: ElementRef<HTMLInputElement>,
        
        private saldoTaquillaService: SaldoTaquillaService,
        private conoService: ConoMonetarioService,
        private swalService: SweetAlertService,
        private cdref: ChangeDetectorRef) {


    }


    ngAfterViewInit(): void {


    }

    ngOnInit(): void {

        this.preferencia.subscribe(data => {
            if (!data) {
                return;
            }
            

            if (data.monedaConoActual.value) {


                this.label_cono_actual =  this.moneda.siglas;
                let monedaId =  this.moneda.id;
                this.label_cono_anterior = '';//data.monedaSiglasConoAnterior.value || //TODO: REVISAR LUEGO

                if (this.operation == 'deposito') {
                    // en el caso que sea una operacion de deposito
                    this.conoService.activesByMoneda(monedaId).subscribe(data => {

                        if (this.cono_actual) {
                            data.map(c => {
                                let index = this.cono_actual.findIndex(ca => ca.id == c.id);
                                if (index >= 0) {

                                    c.cantidad = this.cono_actual[index].cantidad;
                                }
                                return c;
                            })
                        }
                        this.listConoActual.next(data);
                    });
                    if (this.moneda.id == data.monedaConoActual.value) {

                        this.conoService.activesByMoneda(data.monedaConoAnterior.value).subscribe(data => {


                            if (this.cono_anterior) {
                                data.map(c => {
                                    let index = this.cono_anterior.findIndex(ca => ca.id == c.id);
                                    if (index >= 0) {

                                        c.cantidad = this.cono_anterior[index].cantidad;
                                    }
                                    return c;
                                })
                            }

                            this.listConoAnterior.next(data);
                        });
                    }

                } else {
                    // esto para el caso que la operacion es de retiro
                    this.saldoTaquillaService.activesWithDisponibleSaldoTaquillaByMoneda(monedaId).subscribe(data => {

                        // if (this.cono_actual) {
                        //     data.map(c => {
                        //         let index = this.cono_actual.findIndex(ca => ca.id == c.id);
                        //         if (index >= 0) {

                        //             c.cantidad = this.cono_actual[index].cantidad;
                        //         }
                        //         return c;
                        //     })
                        // }\
                        console.log(data);

                        this.listConoActual.next(data);
                    });
                    if (this.moneda.id == data.monedaConoActual.value) {

                        this.saldoTaquillaService.activesWithDisponibleSaldoTaquillaByMoneda(data.monedaConoAnterior.value).subscribe(data => {

                            // if (this.cono_anterior) {
                            //     data.map(c => {
                            //         let index = this.cono_anterior.findIndex(ca => ca.id == c.id);
                            //         if (index >= 0) {

                            //             c.cantidad = this.cono_anterior[index].cantidad;
                            //         }
                            //         return c;
                            //     })
                            // }
                            console.log(data);

                            this.listConoAnterior.next(data);
                        });
                    }


                }


            } else {
                this.listConoActual.next([]);
                this.listConoAnterior.next([]);
                this.swalService.show('Preference Not Found');
            }
            this.cdref.detectChanges();
        })




    }

    onChangeConoActual(elem: ConoMonetario,cantidad:any, total?: number, event?: any) {

        // console.log('update cantidad', event, total);
        // console.log('cantidad', cantidad);
        // console.log('cantidad', cantidad.errors);

        const ix = this.listActual.findIndex(e => e.denominacion == elem.denominacion);

        if (elem.cantidad <= 0 || !elem.cantidad) {
            if (ix >= 0) {
                this.listActual.splice(ix, 1);

                this.conoActual.emit(this.listActual.slice());
            }
        } else {
            if (ix >= 0) {
                this.listActual[ix].cantidad = elem.cantidad;
                this.listActual[ix].errors = cantidad.errors;
            } else {
                elem.errors=cantidad.errors
                this.listActual.push(elem);
            }

            this.conoActual.emit(this.listActual.slice());
        }
    }

    onChangeConoAnterior(elem: ConoMonetario) {
        const ix = this.listAnterior.findIndex(e => e.denominacion == elem.denominacion);

        if (elem.cantidad <= 0 || !elem.cantidad) {
            if (ix >= 0) {
                this.listAnterior.splice(ix, 1);
                // console.log('remove ', this.listAnterior);
                this.conoAnterior.emit(this.listAnterior.slice());
            }

        } else {
            if (ix >= 0) {
                this.listAnterior[ix].cantidad = elem.cantidad;
            } else {
                this.listAnterior.push(elem);
            }

            this.conoAnterior.emit(this.listAnterior.slice());
        }
    }

    public focusNext(i, total) {
        let nextElementSiblingId = 'input_' + i + 1;
        if (i < total) {
            console.log('next ', nextElementSiblingId);

            console.log(document.querySelector(`#${nextElementSiblingId}`));

        }

    }


}
