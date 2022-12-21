import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteTaquillaOperativaFormComponent } from './form/reporte-taquilla-operativa-form.component';


const reporteTaquillaOperativaRoutes: Routes = [

    {
        path: '',
        component: ReporteTaquillaOperativaFormComponent,
        data: { title: 'Reporte Taquilla Operativa' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteTaquillaOperativaRoutes)],
    exports: [RouterModule]
})
export class ReporteTaquillaOperativaRoutingModule {
}

