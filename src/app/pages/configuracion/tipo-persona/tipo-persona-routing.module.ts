import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoPersonaDetailComponent } from './detail/tipo-persona-detail.component';
import { TipoPersonaFormComponent } from './form/tipo-persona-form.component';
import { TipoPersonaTableComponent } from './table/tipo-persona-table.component';


const tipoPersonaRoutes: Routes = [

    {
        path: '',
        component: TipoPersonaTableComponent,
        data: { title: 'Tipos de Personas' }
    },
    {
        path: 'add',
        component: TipoPersonaFormComponent,
        data: { title: 'Crear Tipo de Persona' }
    },
    {
        path: ':id/edit',
        component: TipoPersonaFormComponent,
        data: { title: 'Editar Tipo de Persona' }
    },
    {
        path: ':id/view',
        component: TipoPersonaDetailComponent,
        data: { title: 'Visualizar Tipo de Persona' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoPersonaRoutes)],
    exports: [RouterModule]
})
export class TipoPersonaRoutingModule {
}

