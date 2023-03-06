import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { AdvancedPieChartWidgetModule } from './widgets/advanced-pie-chart-widget/advanced-pie-chart-widget.module';
import { AudienceOverviewWidgetModule } from './widgets/audience-overview-widget/audience-overview-widget.module';
import { BarChartWidgetModule } from './widgets/bar-chart-widget/bar-chart-widget.module';
import { DonutChartWidgetModule } from './widgets/donut-chart-widget/donut-chart-widget.module';
import { LineChartWidgetModule } from './widgets/line-chart-widget/line-chart-widget.module';
import { MapsWidgetModule } from './widgets/maps-widget/maps-widget.module';
import { MarketWidgetModule } from './widgets/market-widget/market-widget.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    SirioSharedModule,

    // Widgets
    BarChartWidgetModule,
    LineChartWidgetModule,
    DonutChartWidgetModule,
    
    AudienceOverviewWidgetModule,
    
    AdvancedPieChartWidgetModule,
    MapsWidgetModule,
    MarketWidgetModule
  ],
  declarations: [DashboardComponent],
  providers: [DashboardService]
})
export class DashboardModule {
}
