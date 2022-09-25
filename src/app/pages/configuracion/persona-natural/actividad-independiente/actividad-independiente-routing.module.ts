import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadIndependienteDetailComponent } from './detail/actividad-independiente-detail.component';
import { ActividadIndependienteFormComponent } from './form/actividad-independiente-form.component';
import { ActividadIndependienteTableComponent } from './table/actividad-independiente-table.component';


const actividadIndependienteRoutes: Routes = [

    {
        path: '',
        component: ActividadIndependienteTableComponent,
        data: { title: 'Actividades Independientes' }
    },
    {
        path: 'add',
        component: ActividadIndependienteFormComponent,
        data: { title: 'Crear Actividad Independiente' }
    },
    {
        path: ':id/edit',
        component: ActividadIndependienteFormComponent,
        data: { title: 'Editar Actividad Independiente' }
    },
    {
        path: ':id/view',
        component: ActividadIndependienteDetailComponent,
        data: { title: 'Visualizar Actividad Independiente' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(actividadIndependienteRoutes)],
    exports: [RouterModule]
})
export class ActividadIndependienteRoutingModule {
}

