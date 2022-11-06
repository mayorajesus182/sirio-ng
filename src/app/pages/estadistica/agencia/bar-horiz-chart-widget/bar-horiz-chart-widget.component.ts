import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

import { BehaviorSubject, Observable } from 'rxjs';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';

@Component({
  selector: 'sirio-bar-horiz-chart-widget',
  templateUrl: './bar-horiz-chart-widget.component.html',
  styleUrls: ['./bar-horiz-chart-widget.component.scss']
})
export class BarHorizChartWidgetComponent implements OnInit {

  @Input() data:  Observable<any>;
  @Input() title: string='Estadísticas';

  highcharts = Highcharts;
  barChart: any = undefined;

  
  isLoading: boolean;

  constructor(
    private saldoAgencia: SaldoAgenciaService,
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {

        this.reload();

  }

  reload() {

    if(!this.data){
      return;
    }

    this.isLoading = true;

    // this.saldoAgencia.getSaldo().subscribe(dat => {
    //   console.log('@@@@ Bar Horizontal ');
    //   console.log(dat);
    //   this.isLoading = false;


    //   if (dat.data['detail-928']) {
    //     const labels = dat.data['detail-928'].map(e => {

    //       return (e.esBillete === 1 ? 'Billete ' : 'Moneda ') + e.denominacion;
    //     });
    //     const monedas = dat.data.monedas;

    //     let datasets = dat.data['detail-928'].map(e => e.disponible);
/*
 [
            {
              name: 'Disponibilidad',
              data: datasets,
              color: '#90ed7d'
            }
          ]
*/
          this.data.subscribe(dataset=>{
            this.isLoading = false;
            if(!dataset.series){
              return;
            }


            this.barChart = {
              series:dataset.series,
              chart: {
                type: 'column',
              },
              title: {
                text: dataset.moneda.nombre + ' - ' + dataset.moneda.siglas,
              },
              xAxis: {
                categories: dataset.labels
              },
    
              yAxis: {
                title: {
                  text: 'Cantidades'
                },
              },
    
    
              tooltip: {
                formatter: function () {
                  
                  let tooltip = '<b>' + this.point.category + '</b><br/>' +
                    '<b>Cantidad:</b> ' + formatNumber(this.point.y, 'es', '1.2')+'<br/>'+
                    '<b>Monto:</b> ' + formatNumber(this.point.y* this.point.category.split(' ')[1], 'es', '1.2');
                  // console.log(tooltip);
    
                  return tooltip;
                }
              },
            } as Highcharts.ChartOptions;

          // });

      // }


      // console.log(this.data);


      this.cdref.detectChanges();
    })

  }
}
