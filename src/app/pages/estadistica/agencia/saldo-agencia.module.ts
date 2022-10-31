import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { LoadingOverlayModule } from 'src/@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { EstadisticaRoutingModule } from '../estadistica-routing.module';

import { BarChartWidgetComponent } from './bar-chart-widget/bar-chart-widget.component';
import { SaldoAgenciaComponent } from './saldo-agencia.component';


@NgModule({
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    // core
    SirioSharedModule,
    MaterialModule,
    SirioCardModule,
    LoadingOverlayModule
  ],
  declarations: [SaldoAgenciaComponent,BarChartWidgetComponent],
  // providers: [DashboardService]
})
export class SaldoAgenciaModule {
}
