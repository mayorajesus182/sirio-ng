import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteEmpresaFormComponent } from './form/reporte-empresa-form.component';


const reporteEmpresaRoutes: Routes = [

    {
        path: '',
        component: ReporteEmpresaFormComponent,
        data: { title: 'Reporte Empresa Transporte' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteEmpresaRoutes)],
    exports: [RouterModule]
})
export class ReporteEmpresaRoutingModule {
}

