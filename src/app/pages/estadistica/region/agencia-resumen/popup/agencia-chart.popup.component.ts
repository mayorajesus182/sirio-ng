import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-agencia-chart.popup',
  templateUrl: './agencia-chart.popup.component.html',
  styleUrls: ['./agencia-chart.popup.component.scss']
})
export class AgenciaChartPopupComponent extends PopupBaseComponent implements OnInit {

  dataTaquilla: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detailTaquilla: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});
  isLoading: boolean = false;
  agencia: string;
  moneda: Moneda = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    private saldoAgenciaService: SaldoAgenciaService,
    dialogRef: MatDialogRef<AgenciaChartPopupComponent>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngOnInit() {
    console.log('defaults ', this.defaults);

    this.agencia = this.defaults.id;

    // this.moneda = { id: this.defaults.payload.moneda, 
    //           nombre: this.defaults.payload.nombreMoneda, 
    //           siglas: this.defaults.payload.siglasMoneda } as Moneda;
    this.reload();
  }


  reload() {

    this.isLoading = true;
    
    this.saldoAgenciaService.datachartByAgencia(this.agencia).subscribe(result => {
      console.log(`detalle de agencia ${this.agencia}`,result);
      
      this.isLoading = false;

    });
  }
}