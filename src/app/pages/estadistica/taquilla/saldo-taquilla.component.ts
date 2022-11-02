import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { Observable } from 'rxjs';
import { BarChartWidgetOptions } from './columnrange-chart-widget/bar-chart-widget-options.interface';

@Component({
  selector: 'sirio-saldo-taquilla-statics',
  templateUrl: './saldo-taquilla.component.html',
  styleUrls: ['./saldo-taquilla.component.scss']
})
export class SaldoTaquillaComponent implements OnInit {

  private static isInitialLoad = true;
  salesData$: Observable<ChartData>;
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

  constructor(    private router: Router) {
    /**
     * Edge wrong drawing fix
     * Navigate anywhere and on Promise right back
     */
    if (/Edge/.test(navigator.userAgent)) {
      if (SaldoTaquillaComponent.isInitialLoad) {
        this.router.navigate(['/apps/chat']).then(() => {
          this.router.navigate(['/']);
        });

        SaldoTaquillaComponent.isInitialLoad = false;
      }
    }

  }

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  /**
   * Everything implemented here is purely for Demo-Demonstration and can be removed and replaced with your implementation
   */
  ngOnInit() {
   



  }

}
