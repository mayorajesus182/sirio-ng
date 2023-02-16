import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatoPersonaTableComponent } from './table/dato-persona-table.component';
import { DatoPersonaFormComponent } from './form/dato-persona-form.component';
import { DatoPersonaDetailComponent } from './detail/dato-persona-detail.component';


const datoPersonaRoutes: Routes = [

    {
        path: '',
        component: DatoPersonaTableComponent,
        data: { title: 'Datos de Persona' }
    },
    {
        path: 'add',
        component: DatoPersonaFormComponent,
        data: { title: 'Crear Dato de Persona' }
    },
    {
        path: ':tipoPersona/:seccion/edit',
        component: DatoPersonaFormComponent,
        data: { title: 'Editar Dato de Persona' }
    },
    {
        path: ':tipoPersona/:seccion/view',
        component: DatoPersonaDetailComponent,
        data: { title: 'Visualizar Dato de Persona' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(datoPersonaRoutes)],
    exports: [RouterModule]
})
export class DatoPersonaRoutingModule {
}

