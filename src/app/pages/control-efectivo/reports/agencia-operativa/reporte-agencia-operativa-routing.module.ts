import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAgenciaOperativaFormComponent } from './form/reporte-agencia-operativa-form.component';


const reporteAgenciaOperativaRoutes: Routes = [

    {
        path: '',
        component: ReporteAgenciaOperativaFormComponent,
        data: { title: 'Reporte Agencia Operativa' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteAgenciaOperativaRoutes)],
    exports: [RouterModule]
})
export class ReporteAgenciaOperativaRoutingModule {
}

