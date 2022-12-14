import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteMaterialFormComponent } from './form/reporte-material-form.component';


const reporteMaterialRoutes: Routes = [

    {
        path: '',
        component: ReporteMaterialFormComponent,
        data: { title: 'Reporte Material Transporte' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteMaterialRoutes)],
    exports: [RouterModule]
})
export class ReporteMaterialRoutingModule {
}

