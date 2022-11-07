import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HCMore from "highcharts/highcharts-more";
import { BehaviorSubject, Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import { formatNumber } from '@angular/common';
@Component({

  selector: 'sirio-bar-vert-chart-widget',
  templateUrl: './bar-vert-chart-widget.component.html',
  styleUrls: ['./bar-vert-chart-widget.component.scss']
})
export class BarVertChartWidgetComponent implements OnInit {

  @Input() data: Observable<any>;
  @Input() title: string = 'Estadísticas';
  @Input() moneda: Moneda;
  // @Input() data: ChartData;
  @Input() options: any;

  highcharts = Highcharts;
  barChart: any = undefined;

  isLoading: boolean;

  constructor(
    private saldoAgencia: SaldoAgenciaService,
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {

    exporting(Highcharts);
    exportData(this.highcharts);
    this.reload();
  }

  reload() {

    if (!this.data) {
      return;
    }
    this.isLoading = true;


    this.data.subscribe(dataset => {
      this.isLoading = false;

      if (!dataset.series) {
        return;
      }


      console.log('dataset', dataset);
      // let series = [{ color: dataset.color, data: dataset.data[this.moneda.id], name: dataset.name }]
      // let labels = dataset.data[this.moneda.id].map(d => {

      //   return d.esBillete == 1 ? 'Billetes ' + d.denominacion : 'Monedas ' + d.denominacion;
      // })


      //TODO: MEJORAS ESTO LUEGO
      let series = dataset.series.map(s => {

        return { color: s.color, data: s.data[this.moneda.id], name: s.name }
      })

      let labels = dataset.labels;

      console.log('series', series);
      console.log('label', labels);
      

      this.barChart = {
        series: series,
        chart: {
          type: 'column',
        },
        title: {
          text: this.moneda.nombre + ' - ' + this.moneda.siglas,
        },
        xAxis: {
          categories: labels,
          title: {
            text: 'Movimientos'
          }
        },

        yAxis: {
          title: {
            text: 'Montos'
          }
        },
        dataLabels: {
          enabled: true,
        },

        plotOptions: {
          series: {
            // borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.point.y ? formatNumber(this.point.y, 'es', '1.2') : '';
              }
              // '{point.y:.1f}'
            }
          }
        },
        //  plotOptions: {
        //    columnrange: {
        //      dataLabels: {
        //        enabled: true,
        //        // format: '{y} VES',
        //        formatter: function () {
        //        console.log(this.y);

        //          return formatNumber(this.y,'es','1.2');
        //       }
        //      }
        //    }
        //  },
      } as Highcharts.ChartOptions;

      // this.cdref.markForCheck();

    })
    //  }

    // this.cdref.detectChanges();
    // })

  }
}
