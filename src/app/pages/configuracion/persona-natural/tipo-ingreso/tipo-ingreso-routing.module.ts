import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoIngresoDetailComponent } from './detail/tipo-ingreso-detail.component';
import { TipoIngresoFormComponent } from './form/tipo-ingreso-form.component';
import { TipoIngresoTableComponent } from './table/tipo-ingreso-table.component';


const tipoIngresoRoutes: Routes = [

    {
        path: '',
        component: TipoIngresoTableComponent,
        data: { title: 'Tipos de Ingresos' }
    },
    {
        path: 'add',
        component: TipoIngresoFormComponent,
        data: { title: 'Crear Tipo de Ingreso' }
    },
    {
        path: ':id/edit',
        component: TipoIngresoFormComponent,
        data: { title: 'Editar Tipo de Ingreso' }
    },
    {
        path: ':id/view',
        component: TipoIngresoDetailComponent,
        data: { title: 'Visualizar Tipo de Ingreso' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(tipoIngresoRoutes)],
    exports: [RouterModule]
})
export class TipoIngresoRoutingModule {
}

