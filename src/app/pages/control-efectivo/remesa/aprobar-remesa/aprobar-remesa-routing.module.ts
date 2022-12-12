import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemesaDetailComponent } from '../consultar-remesa/detail/remesa-detail.component';
import { AprobarRemesaTableComponent } from './table/aprobar-remesa-table.component';


const aprobarRemesaRoutes: Routes = [

    {
        path: '',
        component: AprobarRemesaTableComponent,
        data: { title: 'Aprobar Remesas' }
    },
    {
        path: ':id/view',
        component: RemesaDetailComponent,
        data: { title: 'Visualizar Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(aprobarRemesaRoutes)],
    exports: [RouterModule]
})
export class AprobarRemesaRoutingModule {
}

