import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HCMore from "highcharts/highcharts-more";
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
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
  @Input() moneda: Moneda;

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

    this.data.subscribe(dataset => {
      console.log('@@@@ Bar Column Range saldo agencia: ');
      console.log(dataset);
      this.isLoading = false;

      if(!dataset.series){
        return;
      }


      // let datasets_aument = [];
      // let datasets_desmin = [];
      // let series = [];
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


      // [
      //   {
      //     name: 'Aumentar',
      //     data: dataset.ranges.range1,
      //     color: '#90ed7d'
      //   },
      //   {
      //     name: 'Desminuir',
      //     data: dataset.ranges.range2,
      //     color:'#f45b5b'
      //   },
      // ]
      const labels = dataset.labels;
     if(labels ){

       this.barColumnRangeChart = {
         series: dataset.series,
         chart: {
           type: 'columnrange',
         },
         title: {
           text: this.moneda.nombre+' - '+this.moneda.siglas,
         },
         xAxis: {
           categories: labels
         },
  
         yAxis: {
           title: {
             text: `Montos ( Mill. ${this.moneda.siglas} )`
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
