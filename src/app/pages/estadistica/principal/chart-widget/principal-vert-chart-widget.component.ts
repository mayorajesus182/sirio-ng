import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import exportData from 'highcharts/modules/export-data';
import exporting from 'highcharts/modules/exporting';
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAgenciaReportService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia-report.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';
@Component({

  selector: 'sirio-principal-vert-chart-widget',
  templateUrl: './principal-vert-chart-widget.component.html',
  styleUrls: ['./principal-vert-chart-widget.component.scss']
})
export class PrincipalVertChartWidgetComponent extends ChartBaseComponent implements OnInit {

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

      // console.log(dataset);


      let labels = dataset.labels;

      let series = dataset.series.map(s => {

        return { color: s.color, data: s.data[this.currentMoneda.id], name: s.name }
      })


      // console.log('series', series);
      // console.log('label', labels);
      

      this.barChart = {
        series: series,
        lang:this.lang,
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
      } as Highcharts.ChartOptions;



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
