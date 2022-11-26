import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespacharRemesaFormComponent } from './form/despachar-remesa-form.component';
import { DespacharRemesaTableComponent } from './table/despachar-remesa-table.component';


const despacharRemesaRoutes: Routes = [

    {
        path: '',
        component: DespacharRemesaTableComponent,
        data: { title: 'Despachar Remesas' }
    },
    {
        path: ':id/dispatch',
        component: DespacharRemesaFormComponent,
        data: { title: 'Despachar Remesa' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(despacharRemesaRoutes)],
    exports: [RouterModule]
})
export class DespacharRemesaRoutingModule {
}

