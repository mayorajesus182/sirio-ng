import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAgenciaExcedenteFormComponent } from './form/reporte-agencia-excedente-form.component';


const reporteAgenciaExcedenteRoutes: Routes = [

    {
        path: '',
        component: ReporteAgenciaExcedenteFormComponent,
        data: { title: 'Reporte Agencia con Excedente' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteAgenciaExcedenteRoutes)],
    exports: [RouterModule]
})
export class ReporteAgenciaExcedenteRoutingModule {
}

