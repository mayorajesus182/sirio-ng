import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAcopioService } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';

@Component({
  selector: 'sirio-saldo-transportista-statics',
  templateUrl: './saldo-transportista.component.html',
  styleUrls: ['./saldo-transportista.component.scss']
})
export class SaldoTransportistaComponent extends ChartBaseComponent implements OnInit {

  private static isInitialLoad = true;
  data: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detail: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});



  constructor(
    private router: Router,
    private saldoAcopioService: SaldoAcopioService,
    private saldoTaquilla: SaldoTaquillaService) {

    super();
  }

  refreshData() {
    this.saldoAcopioService.datachart().subscribe(result => {
      console.log("%% saldo acopio %%");
      console.log(result);

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
    })
  }


  ngOnInit() {

    this.refreshData();
  }

  reload() {
    this.refreshData();
  }

}
