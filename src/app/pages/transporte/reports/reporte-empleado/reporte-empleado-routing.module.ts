import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteEmpleadoFormComponent } from './form/reporte-empleado-form.component';


const reporteEmpleadoRoutes: Routes = [

    {
        path: '',
        component: ReporteEmpleadoFormComponent,
        data: { title: 'Reporte Empleado Transporte' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(reporteEmpleadoRoutes)],
    exports: [RouterModule]
})
export class ReporteEmpleadoRoutingModule {
}

