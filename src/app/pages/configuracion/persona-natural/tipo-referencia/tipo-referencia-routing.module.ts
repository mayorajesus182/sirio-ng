import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoReferenciaDetailComponent } from './detail/tipo-referencia-detail.component';
import { TipoReferenciaFormComponent } from './form/tipo-referencia-form.component';
import { TipoReferenciaTableComponent } from './table/tipo-referencia-table.component';


const tipoReferenciaRoutes: Routes = [

    {
        path: '',
        component: TipoReferenciaTableComponent,
        data: { title: 'Tipos de Referencias' }
    },
    {
        path: 'add',
        component: TipoReferenciaFormComponent,
        data: { title: 'Crear Tipo de Referencia' }
    },
    {
        path: ':id/edit',
        component: TipoReferenciaFormComponent,
        data: { title: 'Editar Tipo de Referencia' }
    },
    {
        path: ':id/view',
        component: TipoReferenciaDetailComponent,
        data: { title: 'Visualizar Tipo de Referencia' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(tipoReferenciaRoutes)],
    exports: [RouterModule]
})
export class TipoReferenciaRoutingModule {
}

