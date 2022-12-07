import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemesaDetailComponent } from './detail/remesa-detail.component';
import { ConsultarRemesaTableComponent } from './table/consultar-remesa-table.component';


const consultarRemesaRoutes: Routes = [

    {
        path: '',
        component: ConsultarRemesaTableComponent,
        data: { title: 'Consultar Remesas' }
    },
    {
        path: ':id/view',
        component: RemesaDetailComponent,
        data: { title: 'Visualizar Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(consultarRemesaRoutes)],
    exports: [RouterModule]
})
export class ConsultarRemesaRoutingModule {
}

