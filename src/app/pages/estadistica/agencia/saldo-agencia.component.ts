import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { BarChartWidgetOptions } from './columnrange-chart-widget/bar-columnrange-chart-widget-options.interface';

@Component({
  selector: 'sirio-saldo-agencia-statics',
  templateUrl: './saldo-agencia.component.html',
  styleUrls: ['./saldo-agencia.component.scss']
})
export class SaldoAgenciaComponent implements OnInit {

  private static isInitialLoad = true;
  dataAgencia: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detailAgencia: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas:Moneda[]=[];
  totalSalesOptions: BarChartWidgetOptions = {
    title: 'Total Sales',
    gain: 16.3,
    subTitle: 'compared to last month',
    background: '#3F51B5',
    color: '#FFFFFF'
  };


  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  constructor(
    private router: Router,
    private saldoAgenciaService: SaldoAgenciaService,
    private saldoTaquilla: SaldoTaquillaService) {


  }

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  ngOnInit() {

    this.saldoAgenciaService.all().subscribe(result => {
      // console.log("%% saldo agencia %%");
      // console.log(result);


      let datasets_aument = {  };
      let datasets_desmin = {  };
      let datasets_final = {  };
      let detailCash = {  };
      let series = [];

      this.monedas=result.data.monedas;

      this.monedas.forEach(m => {

        datasets_aument[m.id]= result.data["aumento-" + m.id];

        datasets_desmin[m.id]= result.data["disminucion-" + m.id];
        datasets_final[m.id]= result.data["final-" + m.id];

        detailCash[m.id]= result.data["detail-"+m.id];
      });
      // Object.keys(result.data).forEach(key => {
      //   // dat.data[key];
      //   // console.log(key);
      //   if (key.indexOf('aumento-928') === 0 && !series.includes("aumento")) {
      //     // console.log('push key ', key);
      //     // console.log('dataset key ', dat.data[key]);
      //     series.push("aumento");
      //     datasets_aument = result.data[key];
      //   } else if (key.indexOf('disminucion-928') === 0 && !series.includes("disminucion")) {

      //     series.push("disminucion");
      //     datasets_desmin = result.data[key];
      //   }
      // });
      let datasets = { series: [], labels: [] };
      let datasetDetail = { data: detailCash, labels: [], color:'#90ed7d', name:'Disponible' };

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
          color: '#434348'
        },
      ]

      datasets.labels = result.data.labels;

      this.dataAgencia.next(datasets);
      this.detailAgencia.next(datasetDetail);
    })


  }

}
