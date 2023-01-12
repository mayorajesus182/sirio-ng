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
import { TransBarHorizChartWidgetComponent } from './bar-horiz-chart-widget/trans-barhoriz-chart-widget.component';
import { TransBarVertChartWidgetComponent } from './bar-vert-chart-widget/trans-barvert-chart-widget.component';
import { SaldoTransportistaComponent } from './saldo-transportista.component';


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
  declarations: [ SaldoTransportistaComponent,TransBarHorizChartWidgetComponent,TransBarVertChartWidgetComponent],
  exports:[SaldoTransportistaComponent,TransBarHorizChartWidgetComponent,TransBarVertChartWidgetComponent],
  entryComponents:[]
  // providers: [DashboardService]
})
export class SaldoTransportistaModule {
}
