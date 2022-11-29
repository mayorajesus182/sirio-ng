import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudRemesaDetailComponent } from './detail/solicitud-remesa-detail.component';
import { DespacharRemesaFormComponent } from './form/despachar/despachar-remesa-form.component';
import { ProcesarRemesaFormComponent } from './form/procesar/procesar-remesa-form.component';
import { RecibirRemesaFormComponent } from './form/recibir/recibir-remesa-form.component';
import { SolicitudRemesaFormComponent } from './form/solicitud/solicitud-remesa-form.component';
import { SolicitudRemesaTableComponent } from './table/solicitud-remesa-table.component';


const remesaRoutes: Routes = [

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
        path: ':id/process',
        component: ProcesarRemesaFormComponent,
        data: { title: 'Procesar Remesa' }
    },
    {
        path: ':id/dispatch',
        component: DespacharRemesaFormComponent,
        data: { title: 'Despachar Remesa' }
    },
    {
        path: ':id/receive',
        component: RecibirRemesaFormComponent,
        data: { title: 'Recibir Remesa' }
    },
    {
        path: ':id/view',
        component: SolicitudRemesaDetailComponent,
        data: { title: 'Visualizar Remesa' }
    },

];


@NgModule({
    imports: [RouterModule.forChild(remesaRoutes)],
    exports: [RouterModule]
})
export class RemesaRoutingModule {
}

