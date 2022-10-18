import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoTelefonoDetailComponent } from './detail/tipo-telefono-detail.component';
import { TipoTelefonoFormComponent } from './form/tipo-telefono-form.component';
import { TipoTelefonoTableComponent } from './table/tipo-telefono-table.component';


const tipoTelefonoRoutes: Routes = [

    {
        path: '',
        component: TipoTelefonoTableComponent,
        data: { title: 'Tipos de Teléfono' }
    },
    {
        path: 'add',
        component: TipoTelefonoFormComponent,
        data: { title: 'Crear Tipo de Teléfono' }
    },
    {
        path: ':id/edit',
        component: TipoTelefonoFormComponent,
        data: { title: 'Editar Tipo de Teléfono' }
    },
    {
        path: ':id/view',
        component: TipoTelefonoDetailComponent,
        data: { title: 'Visualizar Tipo de Teléfono' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(tipoTelefonoRoutes)],
    exports: [RouterModule]
})
export class TipoTelefonoRoutingModule {
}

