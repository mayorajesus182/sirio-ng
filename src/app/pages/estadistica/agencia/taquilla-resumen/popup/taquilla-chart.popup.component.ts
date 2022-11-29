import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-taquilla-chart.popup',
  templateUrl: './taquilla-chart.popup.component.html',
  styleUrls: ['./taquilla-chart.popup.component.scss']
})
export class TaquillaChartPopupComponent extends PopupBaseComponent implements OnInit {

  dataTaquilla: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detailTaquilla: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});
  isLoading: boolean = false;
  taquilla: number;
  moneda: Moneda = undefined;
  // public nombreVia = new BehaviorSubject<NombreVia[]>([]);
  // public nombreNucleo = new BehaviorSubject<NombreNucleo[]>([]);
  // public estadonombreCostruccion = new BehaviorSubject<EstadonombreCostruccion[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    private saldoTaquillaService: SaldoTaquillaService,
    dialogRef: MatDialogRef<TaquillaChartPopupComponent>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngOnInit() {
    console.log('defaults ', this.defaults);

    this.taquilla = this.defaults.payload.id;

    this.moneda = { id: this.defaults.payload.moneda, 
              nombre: this.defaults.payload.nombreMoneda, 
              siglas: this.defaults.payload.siglasMoneda } as Moneda;
    this.reload();
  }


  reload() {

    this.isLoading = true;

    this.saldoTaquillaService.dataChartAllByTaquilla(this.taquilla).subscribe(result => {
      // console.log(result);

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
          name: 'Saldo',
          data: datasets_final,
          color: '#28036a'
        },
      ]

      datasets.labels = result.data.labels;


      this.dataTaquilla.next(datasets);
      this.detailTaquilla.next(datasetDetail);
    })
  }
}