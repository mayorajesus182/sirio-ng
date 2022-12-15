import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCostoAvaluoFormComponent } from './form/reporte-costo-avaluo-form.component';


const reporteCostoAvaluoRoutes: Routes = [

    {
        path: '',
        component: ReporteCostoAvaluoFormComponent,
        data: { title: 'Reporte de Costo Avaluo' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCostoAvaluoRoutes)],
    exports: [RouterModule]
})
export class ReporteCostoAvaluoRoutingModule {
}

