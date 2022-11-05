import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import * as Highcharts from 'highcharts';
import HCMore from "highcharts/highcharts-more";
import { Observable } from 'rxjs';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';

@Component({

  selector: 'sirio-bar-columnrange-chart-widget',
  templateUrl: './bar-columnrange-chart-widget.component.html',
  styleUrls: ['./bar-columnrange-chart-widget.component.scss']
})
export class BarColumnRangeChartWidgetComponent implements OnInit {

  @Input() data: Observable<any>;
  // @Input() data: ChartData;
  @Input() options: any;

  highcharts = Highcharts;
  barColumnRangeChart: any = undefined;

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
      console.log('@@@@ Bar Column Range saldo agencia: ');
      console.log(dat);
      this.isLoading = false;

      let datasets_aument = [];
      let datasets_desmin = [];
      let series = [];
      Object.keys(dat.data).forEach(key => {
        // dat.data[key];
        // console.log(key);
        if (key.indexOf('aumento-928') === 0 && !series.includes("aumento")) {
          // console.log('push key ', key);
          // console.log('dataset key ', dat.data[key]);
          // series.push("aumento");
          datasets_aument = dat.data[key];
        }else if(key.indexOf('disminucion-928') === 0 && !series.includes("disminucion")){
          
          // series.push("disminucion");
          datasets_desmin = dat.data[key];
        }
      });


      const labels = dat.data.labels;
      const monedas = dat.data.monedas;
     if(labels && monedas && monedas.length > 0){

       this.barColumnRangeChart = {
         series: [
           {
             name: 'Aumentar',
             data: datasets_aument,
             color: '#90ed7d'
           },
           {
             name: 'Desminuir',
             data: datasets_desmin,
             color:'#f45b5b'
           },
         ],
         chart: {
           type: 'columnrange',
         },
         title: {
           text: monedas[0].nombre+' - '+monedas[0].siglas,
         },
         xAxis: {
           categories: labels
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
     }
       



      // console.log(this.data);


      this.cdref.detectChanges();
    })

  }
}
