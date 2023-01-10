import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteRemesaEnviadaFormComponent } from './form/reporte-remesa-enviada-form.component';


const reporteRemesaEnviadaRoutes: Routes = [

    {
        path: '',
        component: ReporteRemesaEnviadaFormComponent,
        data: { title: 'Reporte Remesa Enviada' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteRemesaEnviadaRoutes)],
    exports: [RouterModule]
})
export class ReporteRemesaEnviadaRoutingModule {
}

