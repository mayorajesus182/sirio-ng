import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { defaultChartOptions } from '../../../../../@sirio/shared/chart-widget/chart-widget-defaults';
import { BarChartWidgetOptions } from './bar-chart-widget-options.interface';

@Component({
  selector: 'sirio-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss']
})
export class BarChartWidgetComponent implements OnInit {

  // data: Observable<ChartData>;

  data: ChartData;
  options: BarChartWidgetOptions = {
    title: 'Total Sales',
    gain: 16.3,
    subTitle: 'compared to last month',
    background: '#3F51B5',
    color: '#FFFFFF'
  };
  chartOptions: ChartOptions = defaultsDeep({
    layout: {
      padding: {
        left: 24,
        right: 24,
        top: 16,
        bottom: 24
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      intersect: true
    }
  }, defaultChartOptions);

  @ViewChild('canvas', { read: ElementRef, static: true }) canvas: ElementRef;

  chart: Chart;

  isLoading: boolean;

  constructor(
    private saldoAgencia: SaldoAgenciaService,
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {

    this.reload();

  }

  reload() {
    this.isLoading = true;

    this.saldoAgencia.getSaldo().subscribe(dat => {
      console.log('@@@@ saldo agencia: ');
      console.log(dat);
      this.isLoading = false;

      let dataset = [];
      let series = [];
      Object.keys(dat.data).forEach(key => {
        // dat.data[key];
        console.log(key);
        
        if (key.indexOf('serie-') === 0 && series.length==0) {
          console.log('push key ',key);
          console.log('dataset key ',dat.data[key]);
          series.push(key); 
          dataset.push(dat.data[key].map(e=>e.data));
        }
      });

      console.log('dataset ',dataset);
      

      this.data = {
        labels: dat.labels,
        datasets: [
          {
            label: '# Movimientos',
            data: dataset,
            backgroundColor: '#FFFFFF',
            barPercentage: 0.8
          }
        ]
      } as ChartData;

      this.cdref.detectChanges();
    })

  }
}
