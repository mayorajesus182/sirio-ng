import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesionDetailComponent } from './detail/profesion-detail.component';
import { ProfesionFormComponent } from './form/profesion-form.component';
import { ProfesionTableComponent } from './table/profesion-table.component';


const profesionRoutes: Routes = [

    {
        path: '',
        component: ProfesionTableComponent,
        data: { title: 'Profesiones' }
    },
    {
        path: 'add',
        component: ProfesionFormComponent,
        data: { title: 'Crear Profesión' }
    },
    {
        path: ':id/edit',
        component: ProfesionFormComponent,
        data: { title: 'Editar Profesión' }
    },
    {
        path: ':id/view',
        component: ProfesionDetailComponent,
        data: { title: 'Visualizar Profesión' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(profesionRoutes)],
    exports: [RouterModule]
})
export class ProfesionRoutingModule {
}

