import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { SaldoAgenciaModule } from './agencia/saldo-agencia.module';
import { EstadisticaRoutingModule } from './estadistica-routing.module';
import { SaldoRegionModule } from './region/saldo-agencia.module';
import { SaldoTaquillaModule } from './taquilla/saldo-taquilla.module';
@NgModule({
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    MaterialModule,
    SirioSharedModule,
    MaterialModule,
    ChartsModule,
    SaldoAgenciaModule,
    SaldoTaquillaModule,
    SaldoRegionModule
  ],
  declarations: [],
  // providers: [
  //   { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] } // add as factory to your providers
  // ]
  // providers: [DashboardService]
})
export class EstadisticaModule {
}
