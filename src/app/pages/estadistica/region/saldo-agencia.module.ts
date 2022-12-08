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
import { RegionVertChartWidgetComponent } from './chart-widget/region-vert-chart-widget.component';

import { SaldoRegionComponent } from './saldo-agencia.component';

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
  declarations: [SaldoRegionComponent,RegionVertChartWidgetComponent],
  exports:[],
})
export class SaldoRegionModule {
}
