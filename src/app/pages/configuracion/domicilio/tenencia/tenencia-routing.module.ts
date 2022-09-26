import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenenciaDetailComponent } from './detail/tenenciadetail.component';
import { TenenciaFormComponent } from './form/tenencia-form.component';
import { TenenciaTableComponent } from './table/tenencia-table.component';


const tenenciaRoutes: Routes = [

    {
        path: '',
        component: TenenciaTableComponent,
        data: { title: 'Tenencia' }
    },
    {
        path: 'add',
        component: TenenciaFormComponent,
        data: { title: 'Crear Tenencia' }
    },
    {
        path: ':id/edit',
        component: TenenciaFormComponent,
        data: { title: 'Editar Tenencia' }
    },
    {
        path: ':id/view',
        component: TenenciaDetailComponent,
        data: { title: 'Visualizar Tenencia' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(tenenciaRoutes)],
    exports: [RouterModule]
})
export class TenenciaRoutingModule {
}

