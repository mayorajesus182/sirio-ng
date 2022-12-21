import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCuadreTaquillaFormComponent } from './form/reporte-cuadre-taquilla-form.component';


const reporteCuadreTaquillaRoutes: Routes = [

    {
        path: '',
        component: ReporteCuadreTaquillaFormComponent,
        data: { title: 'Reporte Cuadre de Taquilla' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCuadreTaquillaRoutes)],
    exports: [RouterModule]
})
export class ReporteCuadreTaquillaRoutingModule {
}

