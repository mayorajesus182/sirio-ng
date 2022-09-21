import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenciaDetailComponent } from './detail/agencia-detail.component';
import { AgenciaFormComponent } from './form/agencia-form.component';
import { AgenciaTableComponent } from './table/agencia-table.component';



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
    }

];


@NgModule({
    imports: [RouterModule.forChild(agenciaRoutes)],
    exports: [RouterModule]
})
export class AgenciaRoutingModule {
}

