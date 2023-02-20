import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCertificadoCuentaFormComponent } from './form/reporte-certificado-cuenta-form.component';


const reporteCertificadoCuentaRoutes: Routes = [

    {
        path: '',
        component: ReporteCertificadoCuentaFormComponent,
        data: { title: 'Reporte Certificado de Cuenta' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteCertificadoCuentaRoutes)],
    exports: [RouterModule]
})
export class ReporteCertificadoCuentaRoutingModule {
}

