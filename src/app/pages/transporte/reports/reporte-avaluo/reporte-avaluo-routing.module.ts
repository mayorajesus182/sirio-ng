import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAvaluoFormComponent } from './form/reporte-avaluo-form.component';


const reporteAvaluoRoutes: Routes = [

    {
        path: '',
        component: ReporteAvaluoFormComponent,
        data: { title: 'Reporte Avaluo Transporte' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteAvaluoRoutes)],
    exports: [RouterModule]
})
export class ReporteAvaluoRoutingModule {
}

