import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';

import exportData from 'highcharts/modules/export-data';
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';

@Component({
  selector: 'sirio-bar-horiz-chart-widget',
  templateUrl: './bar-horiz-chart-widget.component.html',
  styleUrls: ['./bar-horiz-chart-widget.component.scss']
})
export class BarHorizChartWidgetComponent implements OnInit {

  @Input() data: Observable<any>;
  @Input() monedas: Observable<Moneda[]>;
  @Input() title: string = 'Estadísticas';
  currentMoneda: Moneda;
  availableCoins: Moneda[] = [];
  highcharts = Highcharts;
  barChart: any = undefined;


  isLoading: boolean;

  constructor(
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    exporting(Highcharts);
    exportData(this.highcharts);
    this.monedas.subscribe(list => {

      this.currentMoneda = list[0];
      this.availableCoins = list;
      this.reload();

    });

  }

  reload() {

    if (!this.data) {
      return;
    }

    this.isLoading = true;


    this.data.subscribe(dataset => {
      this.isLoading = false;


      if (!dataset.data) {
        return;
      }


      let serie = { name: dataset.name, data: dataset.data[this.currentMoneda.id].map(d => d.disponible), color: dataset.color }
      let labels = dataset.data[this.currentMoneda.id].map(d => {

        return d.esBillete == 1 ? 'Billetes ' + d.denominacion : 'Monedas ' + d.denominacion;
      })

      this.barChart = {
        series: [serie],
        chart: {
          type: 'bar',
        },
        title: {
          text: this.currentMoneda.nombre + ' - ' + this.currentMoneda.siglas,
        },
        xAxis: {
          type: 'category',
          categories: labels,
          title: {
            text: 'Denominación'
          },
        },

        yAxis: {
          title: {
            text: 'Cantidad'
          },
        },
        // dataLabels: {
        //   enabled: true,
        // },

        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.point.y ? formatNumber(this.point.y, 'es', '1.0') : '';
              }
              // '{point.y:.1f}'
            }
          }
        },

        tooltip: {
          formatter: function () {

            let tooltip = '<b>' + this.point.category + '</b><br/>' +
              '<b>Cantidad:</b> ' + formatNumber(this.point.y, 'es', '1.2') + '<br/>' +
              '<b>Monto:</b> ' + formatNumber(this.point.y * this.point.category.split(' ')[1], 'es', '1.2');
            // console.log(tooltip);

            return tooltip;
          }
        },
      } as Highcharts.ChartOptions;


      this.cdref.detectChanges();
    })

  }


  changeMoneda(val) {
    this.currentMoneda = val;
  }
}
