import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemesaDetailComponent } from '../consultar-remesa/detail/remesa-detail.component';
import { DespacharRemesaEnvioFormComponent } from './form/despachar-remesa-envio-form.component';
import { EnviarRemesaFormComponent } from './form/enviar-remesa-form.component';
import { EnviarRemesaTableComponent } from './table/enviar-remesa-table.component';


const enviarRemesaRoutes: Routes = [

    {
        path: '',
        component: EnviarRemesaTableComponent,
        data: { title: 'Enviar Remesas' }
    },
    {
        path: 'add',
        component: EnviarRemesaFormComponent,
        data: { title: 'Crear Envio de Remesa' }
    },
    {
        path: ':id/edit',
        component: EnviarRemesaFormComponent,
        data: { title: 'Editar Envio de Remesa' }
    },
    {
        path: ':id/dispatch',
        component: DespacharRemesaEnvioFormComponent,
        data: { title: 'Despachar Remesa' }
    },
    {
        path: ':id/view',
        component: RemesaDetailComponent,
        data: { title: 'Visualizar Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(enviarRemesaRoutes)],
    exports: [RouterModule]
})
export class EnviarRemesaRoutingModule {
}

