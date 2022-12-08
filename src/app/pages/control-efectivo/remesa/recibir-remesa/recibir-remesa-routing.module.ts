import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemesaDetailComponent } from '../consultar-remesa/detail/remesa-detail.component';
import { RecibirRemesaFormComponent } from './form/recibir-remesa-form.component';
import { RecibirRemesaTableComponent } from './table/recibir-remesa-table.component';


const recibirRemesaRoutes: Routes = [

    {
        path: '',
        component: RecibirRemesaTableComponent,
        data: { title: 'Recibir Remesas' }
    },
    {
        path: ':id/receive',
        component: RecibirRemesaFormComponent,
        data: { title: 'Recibir Remesa' }
    },
    {
        path: ':id/view',
        component: RemesaDetailComponent,
        data: { title: 'Visualizar Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(recibirRemesaRoutes)],
    exports: [RouterModule]
})
export class RecibirRemesaRoutingModule {
}

