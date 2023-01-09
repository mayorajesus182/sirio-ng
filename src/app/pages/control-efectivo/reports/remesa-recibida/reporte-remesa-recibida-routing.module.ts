import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteRemesaRecibidaFormComponent } from './form/reporte-remesa-recibida-form.component';


const reporteRemesaRecibidaRoutes: Routes = [

    {
        path: '',
        component: ReporteRemesaRecibidaFormComponent,
        data: { title: 'Reporte Remesa Recibida' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteRemesaRecibidaRoutes)],
    exports: [RouterModule]
})
export class ReporteRemesaRecibidaRoutingModule {
}

