import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitarRemesaFormComponent } from './form/solicitar-remesa-form.component';
import { SolicitarRemesaTableComponent } from './table/solicitar-remesa-table.component';


const solicitarRemesaRoutes: Routes = [

    {
        path: '',
        component: SolicitarRemesaTableComponent,
        data: { title: 'Solicitar Remesas' }
    },
    {
        path: 'add',
        component: SolicitarRemesaFormComponent,
        data: { title: 'Crear Solicitud de Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(solicitarRemesaRoutes)],
    exports: [RouterModule]
})
export class SolicitarRemesaRoutingModule {
}

