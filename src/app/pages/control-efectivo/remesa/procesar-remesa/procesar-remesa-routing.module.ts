import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemesaDetailComponent } from '../consultar-remesa/detail/remesa-detail.component';
import { ProcesarRemesaFormComponent } from './form/procesar-remesa-form.component';
import { ProcesarRemesaTableComponent } from './table/procesar-remesa-table.component';


const procesarRemesaRoutes: Routes = [

    {
        path: '',
        component: ProcesarRemesaTableComponent,
        data: { title: 'Solicitar Remesas' }
    },
    {
        path: ':id/process',
        component: ProcesarRemesaFormComponent,
        data: { title: 'Procesar Remesa' }
    },
    {
        path: ':id/view',
        component: RemesaDetailComponent,
        data: { title: 'Visualizar Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(procesarRemesaRoutes)],
    exports: [RouterModule]
})
export class ProcesarRemesaRoutingModule {
}

