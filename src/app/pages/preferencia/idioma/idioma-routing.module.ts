import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdiomaDetailComponent } from './detail/idioma-detail.component';
import { IdiomaFormComponent } from './form/idioma-form.component';

import { IdiomaTableComponent } from './table/idioma-table.component';


const idiomaRoutes: Routes = [

    {
        path: '',
        component: IdiomaTableComponent,
        data: { title: 'Idiomas' }
    },
    {
        path: 'add',
        component: IdiomaFormComponent,
        data: { title: 'Crear Idioma' }
    },
    {
        path: ':id/edit',
        component: IdiomaFormComponent,
        data: { title: 'Editar Idioma' }
    },
    {
        path: ':id/view',
        component: IdiomaDetailComponent,
        data: { title: 'Visualizar Idioma' }
    }

];

@NgModule({
    imports: [RouterModule.forChild(idiomaRoutes)],
    exports: [RouterModule]
})
export class IdiomaRoutingModule {
}

