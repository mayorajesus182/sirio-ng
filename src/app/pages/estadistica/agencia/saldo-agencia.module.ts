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
import { BarHorizChartWidgetComponent } from './bar-horiz-chart-widget/bar-horiz-chart-widget.component';
import { BarVertChartWidgetComponent } from './bar-vert-chart-widget/bar-vert-chart-widget.component';
import { BarColumnRangeChartWidgetComponent } from './columnrange-chart-widget/bar-columnrange-chart-widget.component';

import { SaldoAgenciaComponent } from './saldo-agencia.component';
import { TaquillaWidgetComponent } from './taquilla-stats-widget/taquilla-widget.component';
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
  declarations: [SaldoAgenciaComponent,BarColumnRangeChartWidgetComponent,BarHorizChartWidgetComponent, TaquillaWidgetComponent,BarVertChartWidgetComponent],
  // providers: [DashboardService]
})
export class SaldoAgenciaModule {
}
