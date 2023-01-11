import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteRemesaSolicitadaFormComponent } from './form/reporte-remesa-solicitada-form.component';


const reporteRemesaSolicitadaRoutes: Routes = [

    {
        path: '',
        component: ReporteRemesaSolicitadaFormComponent,
        data: { title: 'Reporte Remesa Solicitada' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteRemesaSolicitadaRoutes)],
    exports: [RouterModule]
})
export class ReporteRemesaSolicitadaRoutingModule {
}

