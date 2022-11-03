import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import * as Highcharts from 'highcharts';

import * as exporting from 'highcharts/modules/exporting';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { defaultChartOptions } from '../../../../../@sirio/shared/chart-widget/chart-widget-defaults';
import { BarChartWidgetOptions } from './bar-hz-chart-widget-options.interface';

@Component({

  selector: 'sirio-bar-hz-chart-widget',
  templateUrl: './bar-hz-chart-widget.component.html',
  styleUrls: ['./bar-hz-chart-widget.component.scss']
})
export class BarHorizontalChartWidgetComponent implements OnInit {

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
      console.log('@@@@ Bar Horiz saldo agencia: ');
      console.log(dat);
      this.isLoading = false;


      if (dat.data['detail-928']) {
        const labels = dat.data['detail-928'].map(e => {

          return (e.esBillete === 1 ? 'Billete ' : 'Moneda ') + e.denominacion;
        });
        const monedas = dat.data.monedas;

        let datasets = dat.data['detail-928'].map(e => e.disponible);

        this.barChart = {
          series: [
            {
              name: 'Disponibilidad',
              data: datasets,
              color: '#90ed7d'
            }
          ],
          chart: {
            type: 'column',
          },
          title: {
            text: monedas[0].nombre + ' - ' + monedas[0].siglas,
          },
          xAxis: {
            categories: labels
          },

          yAxis: {
            title: {
              text: 'Denominacion'
            },
          },


          tooltip: {
            formatter: function () {
              
              let tooltip = '<b>' + this.point.category + '</b><br/>' +
                '<b>Cantidad:</b> ' + formatNumber(this.point.y, 'es', '1.2')+'<br/>'+
                '<b>Monto:</b> ' + formatNumber(this.point.y* this.point.category.split(' ')[1], 'es', '1.2');
              // console.log(tooltip);

              return tooltip;
            }
          },
        } as Highcharts.ChartOptions;

      }


      // console.log(this.data);


      this.cdref.detectChanges();
    })

  }
}
