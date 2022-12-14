import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteViajeFormComponent } from './form/reporte-viaje-form.component';


const reporteViajeRoutes: Routes = [

    {
        path: '',
        component: ReporteViajeFormComponent,
        data: { title: 'Reporte Viaje Transporte' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteViajeRoutes)],
    exports: [RouterModule]
})
export class ReporteViajeRoutingModule {
}

