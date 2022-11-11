import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import exportData from 'highcharts/modules/export-data';
import exporting from 'highcharts/modules/exporting';
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
@Component({

  selector: 'sirio-taqbar-vert-chart-widget',
  templateUrl: './taqbar-vert-chart-widget.component.html',
  styleUrls: ['./taqbar-vert-chart-widget.component.scss']
})
export class TaqBarVertChartWidgetComponent implements OnInit {

  @Input() data: Observable<any>;
  @Input() title: string = 'Estadísticas';
  @Input() monedas: Observable<Moneda[]>;
  currentMoneda: Moneda;
  availableCoins: Moneda[] = [];
  @Input() options: any;

  highcharts = Highcharts;
  barChart: any = undefined;

  isLoading: boolean;

  constructor(
    
    private cdref: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    
    
    exporting(Highcharts);
    exportData(this.highcharts);
    this.monedas.subscribe(list=>{
      // console.log('monedas',list);
      this.currentMoneda= list[0];
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

  changeMoneda(val){
    this.barChart=undefined;
    this.currentMoneda=val;
    this.reload();
  }
}
