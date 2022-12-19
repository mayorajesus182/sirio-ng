import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCierreTaquillaFormComponent } from './form/reporte-cierre-taquilla-form.component';


const reporteCierreTaquillaRoutes: Routes = [

    {
        path: '',
        component: ReporteCierreTaquillaFormComponent,
        data: { title: 'Reporte Cierre de Taquilla' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCierreTaquillaRoutes)],
    exports: [RouterModule]
})
export class ReporteCierreTaquillaRoutingModule {
}

