import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldoAgenciaComponent } from './agencia/saldo-agencia.component';

const routes: Routes = [
  {
    path: 'agencia/saldos',
    component: SaldoAgenciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticaRoutingModule {
}