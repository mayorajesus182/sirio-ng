import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';

@Component({
  selector: 'sirio-saldo-taquilla-statics',
  templateUrl: './saldo-taquilla.component.html',
  styleUrls: ['./saldo-taquilla.component.scss']
})
export class SaldoTaquillaComponent extends ChartBaseComponent implements OnInit {

  private static isInitialLoad = true;

  dataTaquilla: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detailTaquilla: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});

  constructor(
    private router: Router,
    private saldoTaquillaService: SaldoTaquillaService) {

    super();

  }

  private refreshData() {

    this.saldoTaquillaService.dataChartAll().subscribe(result => {
      // console.log("%% saldo taquilla %%");
      // console.log(result);

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
          name: 'Saldo',
          data: datasets_final,
          color: '#141a2e'
        },
      ]

      datasets.labels = result.data.labels;


      this.dataTaquilla.next(datasets);
      this.detailTaquilla.next(datasetDetail);
    })
  }

  ngOnInit() {
    

    this.refreshData();

  }


  reload() {
    this.refreshData();
  }

}
