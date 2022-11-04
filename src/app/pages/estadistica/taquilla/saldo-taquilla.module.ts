import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsModule } from 'ng2-charts';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { LoadingOverlayModule } from 'src/@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { ScrollbarModule } from 'src/@sirio/shared/scrollbar/scrollbar.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { EstadisticaRoutingModule } from '../estadistica-routing.module';
import { BarHorizontalTaquillaChartWidgetComponent } from './bar-horizontal-chart-widget/bar-hz-chart-widget.component';

import { BarChartTaquillaWidgetComponent } from './columnrange-chart-widget/bar-chart-widget.component';
import { SaldoTaquillaComponent } from './saldo-taquilla.component';
// import { ChartModule, HIGHCHARTS_MODULES } from 'highcharts-angular';

@NgModule({
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    // core
    SirioSharedModule,
    MaterialModule,
    SirioCardModule,
    ScrollbarModule,
    ChartsModule,
    HighchartsChartModule,
    LoadingOverlayModule
  ],
  declarations: [SaldoTaquillaComponent, BarChartTaquillaWidgetComponent, BarHorizontalTaquillaChartWidgetComponent],
  // providers: [DashboardService]
})
export class SaldoAgenciaModule {
}