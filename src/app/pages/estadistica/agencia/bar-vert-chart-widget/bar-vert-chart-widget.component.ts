import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HCMore from "highcharts/highcharts-more";
import { BehaviorSubject } from 'rxjs';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';

@Component({

  selector: 'sirio-bar-vert-chart-widget',
  templateUrl: './bar-vert-chart-widget.component.html',
  styleUrls: ['./bar-vert-chart-widget.component.scss']
})
export class BarVertChartWidgetComponent implements OnInit {

  @Input() data:  BehaviorSubject<any> = new BehaviorSubject<any>({});
  @Input() title: string = 'Estadísticas';
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

    HCMore(this.highcharts);
    this.reload();
  }

  reload() {
    this.isLoading = true;

    // this.saldoAgencia.getSaldo().subscribe(dat => {
    //   console.log('@@@@ Bar Vertical  ');
    //   console.log(dat);

    let series = [];
    // Object.keys(dat.data).forEach(key => {
    //   // dat.data[key];
    //   // console.log(key);
    //   if (key.indexOf('aumento-928') === 0 && !series.includes("aumento")) {
    //     // console.log('push key ', key);
    //     // console.log('dataset key ', dat.data[key]);
    //     // series.push("aumento");
    //     datasets_aument = dat.data[key];
    //   }else if(key.indexOf('disminucion-928') === 0 && !series.includes("disminucion")){

    //     // series.push("disminucion");
    //     datasets_desmin = dat.data[key];
    //   }
    // });


    // const labels = dat.data.labels;
    // const monedas = dat.data.monedas;
    //  if(labels && monedas && monedas.length > 0){
      // [
      //   {
      //     name: 'Aumentar',
      //     data: datasets_aument,
      //     color: '#90ed7d'
      //   },
      //   {
      //     name: 'Desminuir',
      //     data: datasets_desmin,
      //     color: '#f45b5b'
      //   },
      // ]
    this.data.subscribe(dataset => {
      this.isLoading = false;

      if(!dataset.series){
        return;
      }

      this.barChart = {
        series: dataset.series,
        chart: {
          type: 'columnrange',
        },
        title: {
          text: dataset.moneda.nombre + ' - ' + dataset.moneda.siglas,
        },
        xAxis: {
          categories: dataset.labels
        },

        yAxis: {
          title: {
            text: 'Montos ( Mill. VES )'
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

      this.cdref.markForCheck();

    })
    //  }

    // this.cdref.detectChanges();
    // })

  }
}
