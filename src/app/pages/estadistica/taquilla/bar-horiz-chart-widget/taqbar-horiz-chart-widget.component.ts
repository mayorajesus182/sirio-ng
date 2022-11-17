import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';

import exportData from 'highcharts/modules/export-data';
import { Observable } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';

@Component({
  selector: 'sirio-taqbar-horiz-chart-widget',
  templateUrl: './taqbar-horiz-chart-widget.component.html',
  styleUrls: ['./taqbar-horiz-chart-widget.component.scss']
})
export class TaqBarHorizChartWidgetComponent implements OnInit {

  @Input() data: Observable<any>;
  @Input() monedas: Observable<Moneda[]>;
  @Input() title: string = 'Estadísticas';
  
  @Output('reload') refresh: EventEmitter<any> = new EventEmitter<any>();

  currentMoneda: Moneda;
  availableCoins: Moneda[] = [];
  highcharts = Highcharts;
  barChart: any = undefined;
  private datasets:any;


  isLoading: boolean;

  constructor(
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    exporting(Highcharts);
    exportData(this.highcharts);
    



    this.data.subscribe(dataset => {
      this.datasets = dataset
      this.monedas.subscribe(list => {

        this.currentMoneda = list[0];
        this.availableCoins = list;
        this.reload();
  
      });
    });

  }

  private reload() {

    if (!this.data) {
      return;
    }

    this.isLoading = true;


    // this.data.subscribe(dataset => {
      this.isLoading = false;


      if (!this.datasets.data) {
        return;
      }


      let serie = { name: this.datasets.name, data: this.datasets.data[this.currentMoneda.id].map(d => d.disponible), color: this.datasets.color }
      let labels = this.datasets.data[this.currentMoneda.id].map(d => {

        return d.esBillete == 1 ? 'Billetes ' + d.denominacion : 'Monedas ' + d.denominacion;
      })
      
      let montoTotal = this.datasets.data[this.currentMoneda.id].map(d => d.disponible* d.denominacion).reduce((a, b) => a + b);

      

      this.barChart = {
        series: [serie],
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

        yAxis: {
          title: {
            text: 'Cantidad'
          },
        },
    
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.point.y ? formatNumber(this.point.y, 'es', '1.0') : '';
              }
            }
          }
        },

        tooltip: {
          formatter: function () {

            let tooltip = '<b>' + this.point.category + '</b><br/>' +
              '<b>Cantidad:</b> ' + formatNumber(this.point.y, 'es', '1.2') + '<br/>' +
              '<b>Monto:</b> ' + formatNumber(this.point.y * this.point.category.split(' ')[1], 'es', '1.2');
            // console.log(tooltip);

            return tooltip;
          }
        },
      } as Highcharts.ChartOptions;


      this.cdref.detectChanges();
    // })

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
