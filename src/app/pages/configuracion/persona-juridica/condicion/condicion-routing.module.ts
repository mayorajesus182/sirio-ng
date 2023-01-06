import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CondicionTableComponent } from './table/condicion-table.component';
import { CondicionFormComponent } from './form/condicion-form.component';
import { CondicionDetailComponent } from './detail/condicion-detail.component';


const condicionRoutes: Routes = [

    {
        path: '',
        component: CondicionTableComponent,
        data: { title: 'Condiciones' }
    },
    {
        path: 'add',
        component: CondicionFormComponent,
        data: { title: 'Crear Condicion' }
    },
    {
        path: ':id/edit',
        component: CondicionFormComponent,
        data: { title: 'Editar Condicion' }
    },
    {
        path: ':id/view',
        component: CondicionDetailComponent,
        data: { title: 'Visualizar Condicion' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(condicionRoutes)],
    exports: [RouterModule]
})
export class CondicionRoutingModule {
}

