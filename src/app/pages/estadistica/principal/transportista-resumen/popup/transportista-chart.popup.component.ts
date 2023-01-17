import { ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAcopioService } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-transportista-chart.popup',
  templateUrl: './transportista-chart.popup.component.html',
  styleUrls: ['./transportista-chart.popup.component.scss']
})
export class TransportistaChartPopupComponent extends PopupBaseComponent implements OnInit {

  data: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detail: BehaviorSubject<any> = new BehaviorSubject<any>({});

  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});
  isLoading: boolean = false;
  transportista: string;
  moneda: Moneda = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    private saldoAcopioService: SaldoAcopioService,
    dialogRef: MatDialogRef<TransportistaChartPopupComponent>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngOnInit() {
    console.log('defaults ', this.defaults);

    this.transportista = this.defaults.id;

    // this.moneda = { id: this.defaults.payload.moneda, 
    //           nombre: this.defaults.payload.nombreMoneda, 
    //           siglas: this.defaults.payload.siglasMoneda } as Moneda;
    this.reload();
  }


  reload() {
    if(!this.transportista){
      return;
    }

    this.isLoading = true;
    
    this.saldoAcopioService.datachartByTransportista(this.transportista).subscribe(result => {
      console.log(` data chart ${this.transportista}`,result);
      
      this.isLoading = false;

      let datasets_aument = {};
      let datasets_desmin = {};
      let datasets_final = {};
      let detailCash = {};
      let series = [];

      this.monedas = result.data.monedas;

      this.coinAvailables.next(this.monedas);

      this.monedas.forEach(m => {

        datasets_aument[m.id] = result.data["aumento-" + m.id];

        datasets_desmin[m.id] = result.data["disminucion-" + m.id];
        datasets_final[m.id] = result.data["final-" + m.id];

        detailCash[m.id] = result.data["detail-" + m.id];
      });
      let datasets = { series: [], labels: [] };
      let datasetDetail = { data: detailCash, labels: [], color: '#90ed7d', name: 'Disponible' };

      // console.log(datasetDetail);


      datasets.series = [
        {
          name: 'Aumenta',
          data: datasets_aument,
          color: '#90ed7d'
        },
        {
          name: 'Disminuye',
          data: datasets_desmin,
          color: '#f45b5b'
        },
        {
          name: 'Saldo Final',
          data: datasets_final,
          color: '#28036a'
        },
      ]

      datasets.labels = result.data.labels;


      this.data.next(datasets);
      this.detail.next(datasetDetail);


      this.cdr.detectChanges();
    });
  }
}