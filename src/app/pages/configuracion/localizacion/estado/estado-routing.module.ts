import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoDetailComponent } from './detail/estado-detail.component';
import { EstadoFormComponent } from './form/estado-form.component';
import { EstadoTableComponent } from './table/estado-table.component';


const estadoRoutes: Routes = [

    {
        path: '',
        component: EstadoTableComponent,
        data: { title: 'Estados' }
    },
    {
        path: 'add',
        component: EstadoFormComponent,
        data: { title: 'Crear Estado' }
    },
    {
        path: ':id/edit',
        component: EstadoFormComponent,
        data: { title: 'Editar Estado' }
    },
    {
        path: ':id/view',
        component: EstadoDetailComponent,
        data: { title: 'Visualizar Estado' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(estadoRoutes)],
    exports: [RouterModule]
})
export class EstadoRoutingModule {
}

