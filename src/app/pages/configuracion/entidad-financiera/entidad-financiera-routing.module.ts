import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntidadFinancieraDetailComponent } from './detail/entidad-financiera-detail.component';
import { EntidadFinancieraFormComponent } from './form/entidad-financiera-form.component';
import { EntidadFinancieraTableComponent } from './table/entidad-financiera-table.component'

const entidadFinancieraRoutes: Routes = [

    {
        path: '',
        component: EntidadFinancieraTableComponent,
        data: { title: 'Entidades Financieras' }
    },
    {
        path: 'add',
        component: EntidadFinancieraFormComponent,
        data: { title: 'Crear Entidad Financiera' }
    },
    {
        path: ':id/edit',
        component: EntidadFinancieraFormComponent,
        data: { title: 'Editar Entidad Financiera' }
    },
    {
        path: ':id/view',
        component: EntidadFinancieraDetailComponent,
        data: { title: 'Visualizar Entidad Financiera' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(entidadFinancieraRoutes)],
    exports: [RouterModule]
})
export class EntidadFinancieraRoutingModule {
}

