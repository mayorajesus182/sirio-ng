import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import exportData from 'highcharts/modules/export-data';
import exporting from 'highcharts/modules/exporting';
import { BehaviorSubject, Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoTaquillaReportService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.report.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';
@Component({

  selector: 'sirio-taqbar-vert-chart-widget',
  templateUrl: './taqbar-vert-chart-widget.component.html',
  styleUrls: ['./taqbar-vert-chart-widget.component.scss']
})
export class TaqBarVertChartWidgetComponent extends ChartBaseComponent implements OnInit {

  @Input() data: Observable<any>;
  @Input() title: string = 'Estadísticas';
  @Input() monedas: Observable<Moneda[]>;

  currentMoneda: Moneda;
  availableCoins: Moneda[] = [];
  @Input() options: any;
  @Output('reload') refresh: EventEmitter<any> = new EventEmitter<any>();

  highcharts = Highcharts;
  barChart: any = undefined;

  isLoading: boolean;

  constructor(
    private taquillaReport: SaldoTaquillaReportService,
    private cdref: ChangeDetectorRef) {
    super()
  }


  ngOnInit(): void {


    exporting(Highcharts);
    exportData(this.highcharts);
    this.monedas.subscribe(list => {
      // console.log('monedas',list);
      this.currentMoneda = list[0];
      this.availableCoins = list;
      this.reload();
    });
  }

  reportPdf() {

    this.loadingDataForm.next(true);
    this.taquillaReport.reportResumen().subscribe(data => {
      this.loadingDataForm.next(false);
      console.log('response:', data);
      const name = this.getFileName(data);
      let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
      this.download(name, blob);
    });


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


      // console.log('dataset', dataset);
      // let series = [{ color: dataset.color, data: dataset.data[this.moneda.id], name: dataset.name }]
      // let labels = dataset.data[this.moneda.id].map(d => {

      //   return d.esBillete == 1 ? 'Billetes ' + d.denominacion : 'Monedas ' + d.denominacion;
      // })


      //TODO: MEJORAS ESTO LUEGO
      let series = dataset.series.map(s => {

        return { color: s.color, data: s.data[this.currentMoneda.id], name: s.name }
      })

      let labels = dataset.labels;

      // console.log('series', series);
      // console.log('label', labels);


      this.barChart = {
        series: series,
        chart: {
          type: 'column',
        },
        title: {
          text: this.currentMoneda.nombre,
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
