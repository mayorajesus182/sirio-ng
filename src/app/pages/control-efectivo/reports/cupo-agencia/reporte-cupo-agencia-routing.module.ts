import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCupoAgenciaFormComponent } from './form/reporte-cupo-agencia-form.component';


const reporteCupoAgenciaRoutes: Routes = [

    {
        path: '',
        component: ReporteCupoAgenciaFormComponent,
        data: { title: 'Reporte Cupo de Agencia' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCupoAgenciaRoutes)],
    exports: [RouterModule]
})
export class ReporteCupoAgenciaRoutingModule {
}

