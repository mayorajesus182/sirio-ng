import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() moneda_curr: Moneda=undefined;

  @Output('reload') refresh: EventEmitter<any> = new EventEmitter<any>();
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
    console.log('moneda curr ', this.moneda_curr);
    this.monedas.subscribe(list => {

      this.currentMoneda = this.moneda_curr || list[0];
      this.availableCoins = list;
      this.reload();

    });




  }

  private reload() {

    if (!this.data) {
      return;
    }

    this.isLoading = true;
    
    

    this.data.subscribe(dataset => {
      this.isLoading = false;


      if (!dataset.data) {
        return;
      }


      let serie1 = { name: dataset.name, data: dataset.data[this.currentMoneda.id].map(d => d.disponible), color: dataset.color }
      let serie2 = { name: 'Saldos', 
                  data: dataset.data[this.currentMoneda.id].map(d => d.disponible*d.denominacion), 
                  color: '#28036a',  yAxis: 1,  pointPadding: -0.04,
                  pointPlacement: -0.15 }
      let labels = dataset.data[this.currentMoneda.id].map(d => {

        return d.esBillete == 1 ? 'Billetes ' + d.denominacion : 'Monedas ' + d.denominacion;
      })
      
      // console.log( '%%%%%');
      // console.log(serie1);
      console.log(serie1);
      console.log( '%%%%% serie 2');
      console.log(serie2);
      // console.log( dataset.data[this.currentMoneda.id]);
      // console.log(dataset.data[this.currentMoneda.id].map(d => d.disponible* d.denominacion));
      let montoTotal = dataset.data[this.currentMoneda.id].map(d => d.disponible* d.denominacion).reduce((a, b) => a + b);

      

      this.barChart = {
        series: [serie1,serie2],
        chart: {
          type: 'bar',
        },
        title: {
          text: this.currentMoneda.nombre + ' ( <b>' + ` ${formatNumber(montoTotal, 'es', '1.2')} </b> )`,
        },
        xAxis: {
          type: 'category',
          categories: labels,
          title: {
            text: 'Denominación'
          },
        },

        yAxis: [{
          min: 0,
          title: {
              text: 'Cantidad'
          }
      }, {
          title: {
              text: 'Saldos (Mil.)'
          },
          opposite: true
      }],
      legend: {
        shadow: false
      },
        // {
        //   title: {
        //     text: 'Cantidad'
        //   },
        // },
    
        plotOptions: {
          column: {
            grouping: false,
            shadow: false,
            borderWidth: 0
        },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter: function () {
                // console.log(this.point.series.name+'= '+this.point.y);
                
                return this.point.y ? formatNumber(this.point.y, 'es', this.point.series.name=='Saldos'?'1.2': '1.0') : '';
              }
            }
          }
        },

        tooltip: {
          formatter: function () {
            
             
            let tooltip = '<b>' + this.point.category + '</b><br/>' +
              `<b>${this.point.series.name=='Saldos'?'Monto': 'Cantidad'}:</b> ` + formatNumber(this.point.y, 'es', '1.2') + '<br/>';
              // '<b>Monto:</b> ' + formatNumber(this.point.y * this.point.category.split(' ')[1], 'es', '1.2');
            // console.log(tooltip);

            return tooltip;
          }
        },
      } as Highcharts.ChartOptions;


      this.cdref.detectChanges();
    })
  }
  
  refreshData(){
    this.isLoading = true;
    this.refresh.emit(true);
  }


  changeMoneda(val) {
    this.barChart=undefined;
    this.currentMoneda = val;
    this.reload();
  }
}
