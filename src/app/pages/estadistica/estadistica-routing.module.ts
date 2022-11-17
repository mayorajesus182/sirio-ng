import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldoAgenciaComponent } from './agencia/saldo-agencia.component';
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
  // {
  //   path: 'taquilla/:id/:modena/saldos',
  //   component: SaldoTaquillaComponent,
  //   data:{title:'Saldo Taquilla'}
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticaRoutingModule {
}
