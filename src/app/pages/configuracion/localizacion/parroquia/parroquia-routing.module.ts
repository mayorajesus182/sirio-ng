import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParroquiaDetailComponent } from './detail/parroquia-detail.component';
import { ParroquiaFormComponent } from './form/parroquia-form.component';
import { ParroquiaTableComponent } from './table/parroquia-table.component';


const parroquiaRoutes: Routes = [

    {
        path: '',
        component: ParroquiaTableComponent,
        data: { title: 'Parroquias' }
    },
    {
        path: 'add',
        component: ParroquiaFormComponent,
        data: { title: 'Crear Parroquia' }
    },
    {
        path: ':id/edit',
        component: ParroquiaFormComponent,
        data: { title: 'Editar Parroquia' }
    },
    {
        path: ':id/view',
        component: ParroquiaDetailComponent,
        data: { title: 'Visualizar Parroquia' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(parroquiaRoutes)],
    exports: [RouterModule]
})
export class ParroquiaRoutingModule {
}

