import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SaldoAgencia, SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
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
      console.log("%% saldo agencia %%");
      console.log(result);


      let datasets_aument = [];
      let datasets_desmin = [];
      let series = [];
      Object.keys(result.data).forEach(key => {
        // dat.data[key];
        // console.log(key);
        if (key.indexOf('aumento-928') === 0 && !series.includes("aumento")) {
          // console.log('push key ', key);
          // console.log('dataset key ', dat.data[key]);
          series.push("aumento");
          datasets_aument = result.data[key];
        } else if (key.indexOf('disminucion-928') === 0 && !series.includes("disminucion")) {

          series.push("disminucion");
          datasets_desmin = result.data[key];
        }
      });
      let datasets = { series: [], labels: [] };

      datasets.series = [
        {
          name: 'Aumentar',
          data: datasets_aument,
          color: '#90ed7d'
        },
        {
          name: 'Desminuir',
          data: datasets_desmin,
          color: '#f45b5b'
        },
      ]

      datasets.labels = result.labels;

      this.dataAgencia.next(datasets);
    })


  }

}
