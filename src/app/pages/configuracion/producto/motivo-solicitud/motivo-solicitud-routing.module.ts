import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotivoSolicitudDetailComponent } from './detail/motivo-solicitud-detail.component';
import { MotivoSolicitudFormComponent } from './form/motivo-solicitud-form.component';
import { MotivoSolicitudTableComponent } from './table/motivo-solicitud-table.component';


const motivoSolicitudRoutes: Routes = [

    {
        path: '',
        component: MotivoSolicitudTableComponent,
        data: { title: 'Motivos de Solicitudes' }
    },
    {
        path: 'add',
        component: MotivoSolicitudFormComponent,
        data: { title: 'Crear Motivo de Solicitud' }
    },
    {
        path: ':id/edit',
        component: MotivoSolicitudFormComponent,
        data: { title: 'Editar Motivo de Solicitud' }
    },
    {
        path: ':id/view',
        component: MotivoSolicitudDetailComponent,
        data: { title: 'Visualizar Motivo de Solicitud' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(motivoSolicitudRoutes)],
    exports: [RouterModule]
})
export class MotivoSolicitudRoutingModule {
}

