import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadEconomicaDetailComponent } from './detail/actividad-economica-detail.component';
import { ActividadEconomicaFormComponent } from './form/actividad-economica-form.component';
import { ActividadEconomicaTableComponent } from './table/actividad-economica-table.component';


const actividadEconomicaRoutes: Routes = [

    {
        path: '',
        component: ActividadEconomicaTableComponent,
        data: { title: 'Actividades Económicas' }
    },
    {
        path: 'add',
        component: ActividadEconomicaFormComponent,
        data: { title: 'Crear Actividad Especifica' }
    },
    {
        path: ':id/edit',
        component: ActividadEconomicaFormComponent,
        data: { title: 'Editar Actividad Económica' }
    },
    {
        path: ':id/view',
        component: ActividadEconomicaDetailComponent,
        data: { title: 'Visualizar Actividad Económica' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(actividadEconomicaRoutes)],
    exports: [RouterModule]
})
export class ActividadEconomicaRoutingModule {
}

