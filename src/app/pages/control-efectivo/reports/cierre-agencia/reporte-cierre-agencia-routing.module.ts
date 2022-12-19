import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCierreAgenciaFormComponent } from './form/reporte-cierre-agencia-form.component';


const reporteCierreAgenciaRoutes: Routes = [

    {
        path: '',
        component: ReporteCierreAgenciaFormComponent,
        data: { title: 'Reporte Cierre de Agencia' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCierreAgenciaRoutes)],
    exports: [RouterModule]
})
export class ReporteCierreAgenciaRoutingModule {
}

