import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NucleoDetailComponent } from './detail/nucleo-detail.component';
import { NucleoFormComponent } from './form/nucleo-form.component';
import { NucleoTableComponent } from './table/nucleo-table.component';


const nucleoRoutes: Routes = [

    {
        path: '',
        component: NucleoTableComponent,
        data: { title: 'Nucleos' }
    },
    {
        path: 'add',
        component: NucleoFormComponent,
        data: { title: 'Crear Nucleo' }
    },
    {
        path: ':id/edit',
        component: NucleoFormComponent,
        data: { title: 'Editar Nucleo' }
    },
    {
        path: ':id/view',
        component: NucleoDetailComponent,
        data: { title: 'Visualizar Nucleo' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(nucleoRoutes)],
    exports: [RouterModule]
})
export class NucleoRoutingModule {
}

