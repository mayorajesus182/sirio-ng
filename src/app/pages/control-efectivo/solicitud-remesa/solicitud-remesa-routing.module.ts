import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudRemesaDetailComponent } from './detail/solicitud-remesa-detail.component';
import { SolicitudRemesaFormComponent } from './form/solicitud-remesa-form.component';
import { SolicitudRemesaTableComponent } from './table/solicitud-remesa-table.component';


const solicitudRemesaRoutes: Routes = [

    {
        path: '',
        component: SolicitudRemesaTableComponent,
        data: { title: 'Solicitudes de Remesas' }
    },
    {
        path: 'add',
        component: SolicitudRemesaFormComponent,
        data: { title: 'Crear Solicitud de Remesa' }
    },
    {
        path: ':id/view',
        component: SolicitudRemesaDetailComponent,
        data: { title: 'Visualizar Solicitud de Remesa' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(solicitudRemesaRoutes)],
    exports: [RouterModule]
})
export class SolicitudRemesaRoutingModule {
}

