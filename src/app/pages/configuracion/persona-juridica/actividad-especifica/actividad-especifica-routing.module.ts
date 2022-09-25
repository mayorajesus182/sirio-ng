import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadEspecificaDetailComponent } from './detail/actividad-especifica-detail.component';
import { ActividadEspecificaFormComponent } from './form/actividad-especifica-form.component';
import { ActividadEspecificaTableComponent } from './table/actividad-especifica-table.component';


const actividadEspecificaRoutes: Routes = [

    {
        path: '',
        component: ActividadEspecificaTableComponent,
        data: { title: 'Actividades Especificas' }
    },
    {
        path: 'add',
        component: ActividadEspecificaFormComponent,
        data: { title: 'Crear Actividad Especifica' }
    },
    {
        path: ':id/edit',
        component: ActividadEspecificaFormComponent,
        data: { title: 'Editar Actividad Especifica' }
    },
    {
        path: ':id/view',
        component: ActividadEspecificaDetailComponent,
        data: { title: 'Visualizar Actividad Especifica' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(actividadEspecificaRoutes)],
    exports: [RouterModule]
})
export class ActividadEspecificaRoutingModule {
}

