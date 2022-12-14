import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCostoMaterialFormComponent } from './form/reporte-costo-material-form.component';


const reporteCostoMaterialRoutes: Routes = [

    {
        path: '',
        component: ReporteCostoMaterialFormComponent,
        data: { title: 'Reporte de Costo Material' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCostoMaterialRoutes)],
    exports: [RouterModule]
})
export class ReporteCostoMaterialRoutingModule {
}

