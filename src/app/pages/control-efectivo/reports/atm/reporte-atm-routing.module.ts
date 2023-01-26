import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAtmFormComponent } from './form/reporte-atm-form.component';


const reporteAtmRoutes: Routes = [

    {
        path: '',
        component: ReporteAtmFormComponent,
        data: { title: 'Reporte Atm' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteAtmRoutes)],
    exports: [RouterModule]
})
export class ReporteAtmRoutingModule {
}

