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
import { TaqBarHorizChartWidgetComponent } from './bar-horiz-chart-widget/taqbar-horiz-chart-widget.component';
import { TaqBarVertChartWidgetComponent } from './bar-vert-chart-widget/taqbar-vert-chart-widget.component';

import { SaldoTaquillaComponent } from './saldo-taquilla.component';
// import { ChartModule, HIGHCHARTS_MODULES } from 'highcharts-angular';

@NgModule({
  imports: [
    CommonModule,
    // core
    SirioSharedModule,
    MaterialModule,
    SirioCardModule,
    ScrollbarModule,
    ChartsModule,
    HighchartsChartModule,
    LoadingOverlayModule
  ],
  declarations: [SaldoTaquillaComponent,TaqBarHorizChartWidgetComponent, TaqBarVertChartWidgetComponent],
  exports:[SaldoTaquillaComponent]
  // providers: [DashboardService]
})
export class SaldoTaquillaModule {
}
