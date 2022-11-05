import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { Observable, Subject } from 'rxjs';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { BarChartWidgetOptions } from './columnrange-chart-widget/bar-columnrange-chart-widget-options.interface';

@Component({
  selector: 'sirio-saldo-agencia-statics',
  templateUrl: './saldo-agencia.component.html',
  styleUrls: ['./saldo-agencia.component.scss']
})
export class SaldoAgenciaComponent implements OnInit {

  private static isInitialLoad = true;
  dataAgencia: Subject<any>;
  totalSalesOptions: BarChartWidgetOptions = {
    title: 'Total Sales',
    gain: 16.3,
    subTitle: 'compared to last month',
    background: '#3F51B5',
    color: '#FFFFFF'
  };
  
  
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  constructor(
    private router: Router,
    private saldoAgenciaService: SaldoAgenciaService,
    private saldoTaquilla: SaldoTaquillaService) {
    

  }

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  ngOnInit() {
   
    this.saldoAgenciaService.all().subscribe(data=>{
      console.log(data);
      
        this.dataAgencia.next(data);
    })


  }

}
