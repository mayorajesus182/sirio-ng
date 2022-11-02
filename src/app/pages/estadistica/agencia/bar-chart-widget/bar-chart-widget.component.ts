import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { defaultChartOptions } from '../../../../../@sirio/shared/chart-widget/chart-widget-defaults';
import { BarChartWidgetOptions } from './bar-chart-widget-options.interface';
import * as Highcharts from 'highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import HCMore from "highcharts/highcharts-more";
import { formatNumber } from '@angular/common';

@Component({

  selector: 'sirio-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss']
})
export class BarChartWidgetComponent implements OnInit {

  // data: Observable<ChartData>;

  highcharts = Highcharts;
  barChart: any = undefined;

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

    HCMore(this.highcharts);
    this.reload();

  }

  reload() {
    this.isLoading = true;

    this.saldoAgencia.getSaldo().subscribe(dat => {
      console.log('@@@@ saldo agencia: ');
      console.log(dat);
      this.isLoading = false;

      let datasets_aument = [];
      // let datasets_desmin = [];
      let series = [];
      // Object.keys(dat.data).forEach(key => {
      //   // dat.data[key];
      //   // console.log(key);
      //   if (key.indexOf('aumento-') === 0 && !series.includes("aumento")) {
      //     // console.log('push key ', key);
      //     // console.log('dataset key ', dat.data[key]);
      //     series.push("aumento");
      //     datasets_aument = dat.data[key].map(e => e.data);
      //   }else if(key.indexOf('disminucion-') === 0 && !series.includes("disminucion")){
          
      //     series.push("disminucion");
      //     datasets_desmin = dat.data[key].map(e => e.data);
      //   }

      Object.keys(dat.data).forEach(key => {
          // dat.data[key];
          // console.log(key);
          if (key.indexOf('serie-') === 0 && !series.includes("serie")) {
            // console.log('push key ', key);
            console.log('dataset key ', dat.data[key]);
            series.push("serie");
            datasets_aument = dat.data[key];
          }


      });

      console.log('datasets ', datasets_aument);
      // console.log('dataset disminucion', datasets_desmin);


      // this.data = {
      //   labels: dat.labels,
      //   datasets: [
      //     {
      //       label: '# Movimientos',
      //       data: dataset,
      //       backgroundColor: '#FFFFFF',
      //       barPercentage: 0.8
      //     }
      //   ]
      // } as ChartData;

      const labels = dat.data.labels;
      // this.data = {
      //   labels: labels,
      //   datasets: [
      //     {
      //       label: 'Ingresos',
      //       data: labels.map(() => {
      //         return dataset;
      //       }),
      //       backgroundColor: '#7cb342',
      //     },
      //     {
      //       label: 'Egresos',
      //       data: labels.map(() => {
      //         return [[20, 25], [25, 10]];
      //       }),
      //       backgroundColor: '#ffc107',
      //     },
      //   ]
      // } as ChartData;

      // console.log(labels);

      // console.log(Highcharts.getOptions().colors);
       

      this.barChart = {
        series: [
          {
            name: 'Aumentar',
            data: datasets_aument,
            color: '#90ed7d'
          },
          // {
          //   name: 'Desminuir',
          //   data: datasets_desmin,
          //   color:'#f45b5b'
          // },
        ],
        chart: {
          type: 'columnrange',
        },
        title: {
          text: 'Movimientos de Efectivo',
        },
        xAxis: {
          categories: labels
        },

        yAxis: {
          title: {
            text: 'Montos ( Mill. VES )'
          }
        },
        plotOptions: {
          columnrange: {
            dataLabels: {
              enabled: true,
              // format: '{y} VES',
              formatter: function () {
              console.log(this.y);
              
                return formatNumber(this.y,'es','1.2');
             }
            }
          }
        },
      } as Highcharts.ChartOptions;


      // console.log(this.data);


      this.cdref.detectChanges();
    })

  }
}
