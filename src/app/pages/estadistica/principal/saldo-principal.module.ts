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
import { SaldoAgenciaModule } from '../agencia/saldo-agencia.module';
import { AgenciaChartPopupComponent } from './agencia-resumen/popup/agencia-chart.popup.component';

import { PrincipalVertChartWidgetComponent } from './chart-widget/principal-vertchart-widget.component';
import { PrincipalHorizChartWidgetComponent } from './desglose-chart-widget/desglose-horizchart-widget.component';

import { SaldoPrincipalComponent } from './saldo-principal.component';
import { RegionTableWidgeComponent } from './table-widget/region/region-table-widget.component';
import { TransportistaTableWidgeComponent } from './table-widget/transportista/transportista-table-widget.component';

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
    SaldoAgenciaModule,
    LoadingOverlayModule
  ],
  declarations: [
    SaldoPrincipalComponent,
    RegionTableWidgeComponent,
    TransportistaTableWidgeComponent,
    PrincipalVertChartWidgetComponent,
    AgenciaChartPopupComponent,
    PrincipalHorizChartWidgetComponent,
  ],
  exports:[],
})
export class SaldoPrincipalModule {
}
