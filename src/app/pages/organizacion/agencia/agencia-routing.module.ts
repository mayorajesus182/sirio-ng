import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CupoAgenciaTableComponent } from './cupos/table/cupo-agencia-table.component';
import { AgenciaDetailComponent } from './detail/agencia-detail.component';
import { AgenciaFormComponent } from './form/agencia-form.component';
import { ActualizarSaldoAgenciaFormComponent } from './saldos/form/actualizar-saldo-agencia-form.component';
import { AgenciaTableComponent } from './table/agencia-table.component';
import { ConsultarSaldoAgenciaFormComponent } from './consultar-saldos/form/consultar-saldo-agencia-form.component';



const agenciaRoutes: Routes = [

    {
        path: '',
        component: AgenciaTableComponent,
        data: { title: 'Agencia' }
    },
    {
        path: 'add',
        component: AgenciaFormComponent,
        data: { title: 'Crear Agencia' }
    },
    {
        path: ':id/edit',
        component: AgenciaFormComponent,
        data: { title: 'Editar Agencia' }
    },
    {
        path: ':id/view',
        component: AgenciaDetailComponent,
        data: { title: 'Visualizar Agencia' }
    },
    {
        path: ':id/assign',
        component: CupoAgenciaTableComponent,
        data: { title: 'Cupos de la Agencia' }
    },
    {
        path: ':id/balance',
        component: ActualizarSaldoAgenciaFormComponent,
        data: { title: 'Saldo de la Agencia' }
    },
    {
        path: ':id/check',
        component: ConsultarSaldoAgenciaFormComponent,
        data: { title: 'Consultar Saldo de la Agencia' }
    },
];


@NgModule({
    imports: [RouterModule.forChild(agenciaRoutes)],
    exports: [RouterModule]
})
export class AgenciaRoutingModule {
}

