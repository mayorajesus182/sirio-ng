import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldoAgenciaComponent } from './agencia/saldo-agencia.component';
import { SaldoRegionComponent } from './region/saldo-region.component';
import { SaldoTaquillaComponent } from './taquilla/saldo-taquilla.component';

const routes: Routes = [
  {
    path: 'agencia/saldos',
    component: SaldoAgenciaComponent,
    data:{title:'Saldo Agencia'}
  },
  {
    path: 'taquilla/saldos',
    component: SaldoTaquillaComponent,
    data:{title:'Saldo Taquilla'}
  },
  {
    path: 'region/saldos',
    component: SaldoRegionComponent,
    data:{title:'Saldo Regional'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticaRoutingModule {
}
