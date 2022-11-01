import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { LoadingOverlayModule } from 'src/@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { ScrollbarModule } from 'src/@sirio/shared/scrollbar/scrollbar.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { EstadisticaRoutingModule } from '../estadistica-routing.module';

import { BarChartWidgetComponent } from './bar-chart-widget/bar-chart-widget.component';
import { SaldoAgenciaComponent } from './saldo-agencia.component';
import { TaquillaWidgetComponent } from './taquilla-stats-widget/taquilla-widget.component';


@NgModule({
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    // core
    SirioSharedModule,
    MaterialModule,
    SirioCardModule,
    ScrollbarModule,
    LoadingOverlayModule
  ],
  declarations: [SaldoAgenciaComponent,BarChartWidgetComponent, TaquillaWidgetComponent],
  // providers: [DashboardService]
})
export class SaldoAgenciaModule {
}
