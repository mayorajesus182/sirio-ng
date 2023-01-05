import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCuadreAgenciaFormComponent } from './form/reporte-cuadre-agencia-form.component';


const reporteCuadreAgenciaRoutes: Routes = [

    {
        path: '',
        component: ReporteCuadreAgenciaFormComponent,
        data: { title: 'Reporte Cuadre de Agencia' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCuadreAgenciaRoutes)],
    exports: [RouterModule]
})
export class ReporteCuadreAgenciaRoutingModule {
}

