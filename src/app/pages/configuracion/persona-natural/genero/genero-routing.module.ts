import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneroDetailComponent } from './detail/genero-detail.component';
import { GeneroFormComponent } from './form/genero-form.component';
import { GeneroTableComponent } from './table/genero-table.component';


const generoRoutes: Routes = [

    {
        path: '',
        component: GeneroTableComponent,
        data: { title: 'Géneros' }
    },
    {
        path: 'add',
        component: GeneroFormComponent,
        data: { title: 'Crear Género' }
    },
    {
        path: ':id/edit',
        component: GeneroFormComponent,
        data: { title: 'Editar Género' }
    },
    {
        path: ':id/view',
        component: GeneroDetailComponent,
        data: { title: 'Visualizar Género' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(generoRoutes)],
    exports: [RouterModule]
})
export class GeneroRoutingModule {
}

