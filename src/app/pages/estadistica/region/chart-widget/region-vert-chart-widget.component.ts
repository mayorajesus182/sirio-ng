import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import exportData from 'highcharts/modules/export-data';
import exporting from 'highcharts/modules/exporting';
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAgenciaReportService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.report.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';
@Component({

  selector: 'sirio-region-vert-chart-widget',
  templateUrl: './region-vert-chart-widget.component.html',
  styleUrls: ['./region-vert-chart-widget.component.scss']
})
export class RegionVertChartWidgetComponent extends ChartBaseComponent implements OnInit {

  @Input() data: Observable<any>;
  @Input() title: string = 'Estadísticas';
  @Input() monedas: Observable<Moneda[]>;
  @Input() moneda_curr: Moneda = undefined;
  currentMoneda: Moneda;
  availableCoins: Moneda[] = [];
  @Input() options: any;

  @Output('reload') refresh: EventEmitter<any> = new EventEmitter<any>();

  highcharts = Highcharts;
  barChart: any = undefined;

  isLoading: boolean;

  constructor(
    private agenciaReport: SaldoAgenciaReportService,
    private cdref: ChangeDetectorRef) {
    super()
  }
  ngOnInit(): void {

    exporting(Highcharts);
    exportData(this.highcharts);
    console.log('moneda curr ', this.moneda_curr);

    this.monedas.subscribe(list => {
      console.log('monedas observable',list);

      this.currentMoneda = this.moneda_curr || list[0];
      this.availableCoins = list;
      this.reload();
    });
  }

  reportPdf() {

    this.loadingDataForm.next(true);
    // this.agenciaReport.reportResumen().subscribe(data => {
    //   this.loadingDataForm.next(false);
    //   console.log('response:', data);
    //   const name = this.getFileName(data);
    //   let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
    //   this.download(name, blob);
    // });
  }

  private reload() {

    if (!this.data) {
      return;
    }
    this.isLoading = true;


    this.data.subscribe(dataset => {
      this.isLoading = false;

      if (!dataset.series) {
        return;
      }


      //TODO: MEJORAS ESTO LUEGO
      // let series = dataset.series.map(s => {

      //   return { color: s.color, data: s.data[this.currentMoneda.id], name: s.name }
      // })

      let labels = dataset.labels;
      const montoTotal= dataset.series[2].data.reduce((a, b) => a + b);


      this.barChart = {
        series: dataset.series,
        chart: {
          type: 'column',
        },
        title: {
          // text: this.currentMoneda.nombre,
          text: 'SALDO DE <b>' + ` ${formatNumber(montoTotal, 'es', '1.2')} </b> EN `+this.currentMoneda.nombre ,
        },
        xAxis: {
          categories: labels,
          title: {
            text: 'Agencias'
          }
        },
        yAxis: [{
          min: 0,
          title: {
            text: 'Saldo vs Cupo [Min-MAx]'
          }
        }],
        legend: {
          shadow: false
        },
        tooltip: {
          shared: true
        },
        dataLabels: {
          enabled: true,
        },

        plotOptions: {
          column: {
            grouping: false,
            shadow: false,
            borderWidth: 0
          },
          series: {
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.point.y ? formatNumber(this.point.y, 'es', '1.2') : '';
              }

            }
          }
        },
        // plotOptions: {
        //   series: {

        //     dataLabels: {
        //       enabled: true,
        //       formatter: function () {
        //         return this.point.y ? formatNumber(this.point.y, 'es', '1.2') : '';
        //       }

        //     }
        //   }
        // },

      } as Highcharts.ChartOptions;


      /*
       chart: {
        type: 'column'
    },
    title: {
        text: 'Efficiency Optimization by Branch'
    },
    xAxis: {
        categories: [
            'Seattle HQ',
            'San Francisco',
            'Tokyo'
        ]
    },
    yAxis: [{
        min: 0,
        title: {
            text: 'Employees'
        }
    }, {
        title: {
            text: 'Profit (millions)'
        },
        opposite: true
    }],
    legend: {
        shadow: false
    },
    tooltip: {
        shared: true
    },
    plotOptions: {
        column: {
            grouping: false,
            shadow: false,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Employees',
        color: 'rgba(165,170,217,1)',
        data: [150, 73, 20],
        pointPadding: 0.3,
        pointPlacement: -0.2
    }, {
        name: 'Employees Optimized',
        color: 'rgba(126,86,134,.9)',
        data: [140, 90, 40],
        pointPadding: 0.4,
        pointPlacement: -0.2
    }, {
        name: 'Profit',
        color: 'rgba(248,161,63,1)',
        data: [183.6, 178.8, 198.5],
        tooltip: {
            valuePrefix: '$',
            valueSuffix: ' M'
        },
        pointPadding: 0.3,
        pointPlacement: 0.2,
        yAxis: 1
    }, {
        name: 'Profit Optimized',
        color: 'rgba(186,60,61,.9)',
        data: [203.6, 198.8, 208.5],
        tooltip: {
            valuePrefix: '$',
            valueSuffix: ' M'
        },
        pointPadding: 0.4,
        pointPlacement: 0.2,
        yAxis: 1
    }]
      */



    })


  }

  refreshData() {
    this.isLoading = true;
    this.refresh.emit(true);
  }

  changeMoneda(val) {
    this.barChart = undefined;
    this.currentMoneda = val;
    this.reload();
  }
}
