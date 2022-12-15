import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCostoViajeFormComponent } from './form/reporte-costo-viaje-form.component';


const reporteCostoViajeRoutes: Routes = [

    {
        path: '',
        component: ReporteCostoViajeFormComponent,
        data: { title: 'Reporte de Costo Viaje' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCostoViajeRoutes)],
    exports: [RouterModule]
})
export class ReporteCostoViajeRoutingModule {
}

