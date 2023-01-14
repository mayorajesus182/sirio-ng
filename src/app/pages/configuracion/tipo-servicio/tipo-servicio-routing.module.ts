import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoServicioTableComponent } from './table/tipo-servicio-table.component';
import { TipoServicioFormComponent } from './form/tipo-servicio-form.component';
import { TipoServicioDetailComponent } from './detail/tipo-servicio-detail.component';



const tipoServicioRoutes: Routes = [

    {
        path: '',
        component: TipoServicioTableComponent,
        data: { title: 'Tipos de Servicio' }
    },
    {
        path: 'add',
        component: TipoServicioFormComponent,
        data: { title: 'Crear Tipo de Servicio' }
    },
    {
        path: ':id/edit',
        component: TipoServicioFormComponent,
        data: { title: 'Editar Tipo de Servicio' }
    },
    {
        path: ':id/view',
        component: TipoServicioDetailComponent,
        data: { title: 'Visualizar Tipo de Servicio' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoServicioRoutes)],
    exports: [RouterModule]
})
export class TipoServicioRoutingModule {
}

