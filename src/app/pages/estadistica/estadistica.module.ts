import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { SaldoAgenciaModule } from './agencia/saldo-agencia.module';
import { EstadisticaRoutingModule } from './estadistica-routing.module';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
@NgModule({
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    MaterialModule,
    SirioSharedModule,
    MaterialModule,
    ChartsModule,
    SaldoAgenciaModule,
  ],
  declarations: [],
  // providers: [
  //   { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] } // add as factory to your providers
  // ]
  // providers: [DashboardService]
})
export class EstadisticaModule {
}
