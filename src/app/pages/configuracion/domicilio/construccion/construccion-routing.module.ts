import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstruccionDetailComponent } from './detail/construccion-detail.component';
import { ConstruccionFormComponent } from './form/construccion-form.component';
import { ConstruccionTableComponent } from './table/construccion-table.component';


const construccionRoutes: Routes = [

    {
        path: '',
        component: ConstruccionTableComponent,
        data: { title: 'Construcciones' }
    },
    {
        path: 'add',
        component: ConstruccionFormComponent,
        data: { title: 'Crear Construccion' }
    },
    {
        path: ':id/edit',
        component: ConstruccionFormComponent,
        data: { title: 'Editar Construccion' }
    },
    {
        path: ':id/view',
        component: ConstruccionDetailComponent,
        data: { title: 'Visualizar Construccion' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(construccionRoutes)],
    exports: [RouterModule]
})
export class ConstruccionRoutingModule {
}

