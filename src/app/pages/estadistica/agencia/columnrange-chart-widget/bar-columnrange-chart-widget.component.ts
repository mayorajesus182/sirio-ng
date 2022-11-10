import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HCMore from "highcharts/highcharts-more";
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';

@Component({

  selector: 'sirio-bar-columnrange-chart-widget',
  templateUrl: './bar-columnrange-chart-widget.component.html',
  styleUrls: ['./bar-columnrange-chart-widget.component.scss']
})
export class BarColumnRangeChartWidgetComponent implements OnInit {

  @Input() data: Observable<any>;
  // @Input() data: ChartData;
  @Input() options: any;
  @Input() title: string;
  @Input() monedas: Moneda[]=[];
  currentMoneda: Moneda;
  availableCoins: Moneda[] = [];

  highcharts = Highcharts;
  barColumnRangeChart: any = undefined;

  isLoading: boolean;

  constructor(
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.currentMoneda= this.monedas[0];
    HCMore(this.highcharts);
    this.reload();

  }

  reload() {
    if(!this.data){
      return;
    }
    this.isLoading = true;

    this.data.subscribe(dataset => {
      // console.log('@@@@ Bar Column Range saldo agencia ');
      // console.log(dataset);
      this.isLoading = false;

      if(!dataset.series){
        return;
      }

      //TODO: MEJORAS ESTO LUEGO
      let series = dataset.series.map(s=>{

        return {color: s.color,data: s.data[this.currentMoneda.id],name:s.name}
      })
  

      const labels = dataset.labels;
     if(labels ){

       this.barColumnRangeChart = {
         series: series,
         chart: {
           type: 'columnrange',
         },
         title: {
           text: this.currentMoneda.nombre+' - '+this.currentMoneda.siglas,
         },
         xAxis: {
           categories: labels
         },
  
         yAxis: {
           title: {
             text: `Montos ( Mill. ${this.currentMoneda.siglas} )`
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

  onchangeMoneda(val){
    this.currentMoneda=val;
  }
}
