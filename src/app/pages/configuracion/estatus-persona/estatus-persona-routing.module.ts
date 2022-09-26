import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstatusPersonaDetailComponent } from './detail/estatus-persona-detail.component';
import { EstatusPersonaFormComponent } from './form/estatus-persona-form.component';
import { EstatusPersonaTableComponent } from './table/estatus-persona-table.component';


const estatusPersonaRoutes: Routes = [

    {
        path: '',
        component: EstatusPersonaTableComponent,
        data: { title: 'Estatus de Personas' }
    },
    {
        path: 'add',
        component: EstatusPersonaFormComponent,
        data: { title: 'Crear Estatus de Persona' }
    },
    {
        path: ':id/edit',
        component: EstatusPersonaFormComponent,
        data: { title: 'Editar Estatus de Persona' }
    },
    {
        path: ':id/view',
        component: EstatusPersonaDetailComponent,
        data: { title: 'Visualizar Estatus de Persona' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(estatusPersonaRoutes)],
    exports: [RouterModule]
})
export class EstatusPersonaRoutingModule {
}

