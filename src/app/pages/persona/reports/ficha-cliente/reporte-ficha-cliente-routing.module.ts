import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteFichaClienteFormComponent } from './form/reporte-ficha-cliente-form.component';


const reporteFichaClienteRoutes: Routes = [

    {
        path: '',
        component: ReporteFichaClienteFormComponent,
        data: { title: 'Reporte Ficha Cliente' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteFichaClienteRoutes)],
    exports: [RouterModule]
})
export class ReporteFichaClienteRoutingModule {
}

