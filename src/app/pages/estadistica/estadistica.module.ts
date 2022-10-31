import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { SaldoAgenciaModule } from './agencia/saldo-agencia.module';
import { EstadisticaRoutingModule } from './estadistica-routing.module';

@NgModule({
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    MaterialModule,
    SirioSharedModule,
    MaterialModule,
    SaldoAgenciaModule
  ],
  declarations: [],
  // providers: [DashboardService]
})
export class EstadisticaModule {
}
