import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NivelPersonaTableComponent } from './table/nivel-persona-table.component';
import { NivelPersonaFormComponent } from './form/nivel-persona-form.component';
import { NivelPersonaDetailComponent } from './detail/nivel-persona-detail.component';


const nivelPersonaRoutes: Routes = [

    {
        path: '',
        component: NivelPersonaTableComponent,
        data: { title: 'Niveles de Persona' }
    },
    {
        path: 'add',
        component: NivelPersonaFormComponent,
        data: { title: 'Crear Nivel de Persona' }
    },
    {
        path: ':id/edit',
        component: NivelPersonaFormComponent,
        data: { title: 'Editar Nivel de Persona' }
    },
    {
        path: ':id/view',
        component: NivelPersonaDetailComponent,
        data: { title: 'Visualizar Nivel de Persona' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(nivelPersonaRoutes)],
    exports: [RouterModule]
})
export class NivelPersonaRoutingModule {
}

