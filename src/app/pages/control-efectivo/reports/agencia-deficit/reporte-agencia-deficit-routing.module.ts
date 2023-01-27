import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAgenciaDeficitFormComponent } from './form/reporte-agencia-deficit-form.component';



const reporteAgenciaDeficitRoutes: Routes = [

    {
        path: '',
        component: ReporteAgenciaDeficitFormComponent,
        data: { title: 'Reporte Agencia con Deficit' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteAgenciaDeficitRoutes)],
    exports: [RouterModule]
})
export class ReporteAgenciaDeficitRoutingModule {
}

