import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsModule } from 'ng2-charts';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { LoadingOverlayModule } from 'src/@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { ScrollbarModule } from 'src/@sirio/shared/scrollbar/scrollbar.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BarHorizChartWidgetComponent } from './bar-horiz-chart-widget/bar-horiz-chart-widget.component';
import { BarVertChartWidgetComponent } from './bar-vert-chart-widget/bar-vert-chart-widget.component';
import { BarColumnRangeChartWidgetComponent } from './columnrange-chart-widget/bar-columnrange-chart-widget.component';

import { SaldoAgenciaComponent } from './saldo-agencia.component';
import { TaquillaChartPopupComponent } from './taquilla-resumen/popup/taquilla-chart.popup.component';
import { TaquillaWidgetComponent } from './taquilla-stats-widget/taquilla-widget.component';
// import { ChartModule, HIGHCHARTS_MODULES } from 'highcharts-angular';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    // core
    SirioSharedModule,
    SharedComponentModule,
    MaterialModule,
    SirioCardModule,
    ScrollbarModule,
    ChartsModule,
    HighchartsChartModule,
    LoadingOverlayModule
  ],
  declarations: [TaquillaChartPopupComponent, SaldoAgenciaComponent,BarColumnRangeChartWidgetComponent,BarHorizChartWidgetComponent, TaquillaWidgetComponent,BarVertChartWidgetComponent],
  exports:[SaldoAgenciaComponent,BarHorizChartWidgetComponent,BarVertChartWidgetComponent],
  entryComponents:[TaquillaChartPopupComponent]
  // providers: [DashboardService]
})
export class SaldoAgenciaModule {
}
