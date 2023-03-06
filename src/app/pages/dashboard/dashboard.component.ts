import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { Observable } from 'rxjs';
import { ChartWidgetOptions } from 'src/@sirio/shared/chart-widget/chart-widget-options.interface';
import { DashboardService } from './dashboard.service';
import { AdvancedPieChartWidgetOptions } from './widgets/advanced-pie-chart-widget/advanced-pie-chart-widget-options.interface';
import { AudienceOverviewWidgetOptions } from './widgets/audience-overview-widget/audience-overview-widget-options.interface';
import { BarChartWidgetOptions } from './widgets/bar-chart-widget/bar-chart-widget-options.interface';
import { DonutChartWidgetOptions } from './widgets/donut-chart-widget/donut-chart-widget-options.interface';


@Component({
  selector: 'sirio-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private static isInitialLoad = true;
  salesData$: Observable<ChartData>;
  totalSalesOptions: BarChartWidgetOptions = {
    title: 'Total Sales',
    gain: 16.3,
    subTitle: 'compared to last month',
    background: '#3F51B5',
    color: '#FFFFFF'
  };
  visitsData$: Observable<ChartData>;
  totalVisitsOptions: ChartWidgetOptions = {
    title: 'Visits',
    gain: 42.5,
    subTitle: 'compared to last month',
    background: '#03A9F4',
    color: '#FFFFFF'
  };
  clicksData$: Observable<ChartData>;
  totalClicksOptions: ChartWidgetOptions = {
    title: 'Total Clicks',
    gain: -6.1,
    subTitle: 'compared to last month',
    background: '#4CAF50',
    color: '#FFFFFF'
  };
  conversionsData$: Observable<ChartData>;
  conversionsOptions: ChartWidgetOptions = {
    title: 'Conversions',
    gain: 10.4,
    subTitle: 'compared to last month',
    background: '#009688',
    color: '#FFFFFF'
  };
  salesSummaryData$: Observable<ChartData>;
  
  top5CategoriesData$: Observable<ChartData>;
  top5CategoriesOptions: DonutChartWidgetOptions = {
    title: 'Top Categories',
    subTitle: 'Compare Sales by Category'
  };
  audienceOverviewOptions: AudienceOverviewWidgetOptions[] = [];
  recentSalesData$: Observable<ChartData>;
  
  recentSalesTableOptions = {
    pageSize: 5,
    columns: [
      { name: 'Product', property: 'name', visible: true, isModelProperty: true },
      { name: '$ Price', property: 'price', visible: true, isModelProperty: true },
      { name: 'Time ago', property: 'timestamp', visible: true, isModelProperty: true },
    ]
  };
  recentSalesTableData$: Observable<any[]>;
  advancedPieChartOptions: AdvancedPieChartWidgetOptions = {
    title: 'Sales by country',
    subTitle: 'Top 3 countries sold 34% more items this month\n'
  };
  advancedPieChartData$: Observable<ChartData>;
  
  
  
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  constructor(private dashboardService: DashboardService,
              private router: Router) {
    /**
     * Edge wrong drawing fix
     * Navigate anywhere and on Promise right back
     */
    if (/Edge/.test(navigator.userAgent)) {
      if (DashboardComponent.isInitialLoad) {
        this.router.navigate(['/apps/chat']).then(() => {
          this.router.navigate(['/']);
        });

        DashboardComponent.isInitialLoad = false;
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
   



    // Prefill realtimeUsersPages with 3 random values
    const demoPages = [];
    const demoPagesPossibleValues = ['/components', '/tables/all-in-one-table', '/apps/inbox', '/apps/chat', '/dashboard', '/login', '/register', '/apps/calendar', '/forms/form-elements'];
    for (let i = 0; i < 3; i++) {
      const nextPossibleValue = demoPagesPossibleValues[+Math.round(Math.random() * (demoPagesPossibleValues.length - 1))];
      if (demoPages.indexOf(nextPossibleValue) === -1) {
        demoPages.push(nextPossibleValue);
      }

    }

    

  }

}
