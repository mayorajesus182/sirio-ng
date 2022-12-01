import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
];

@NgModule({
    imports: [RouterModule.forChild(enviarRemesaRoutes)],
    exports: [RouterModule]
})
export class EnviarRemesaRoutingModule {
}

