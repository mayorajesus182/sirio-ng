import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaisDetailComponent } from './detail/pais-detail.component';
import { PaisFormComponent } from './form/pais-form.component';
import { PaisTableComponent } from './table/pais-table.component';


const paisRoutes: Routes = [

    {
        path: '',
        component: PaisTableComponent,
        data: { title: 'Países' }
    },
    {
        path: 'add',
        component: PaisFormComponent,
        data: { title: 'Crear País' }
    },
    {
        path: ':id/edit',
        component: PaisFormComponent,
        data: { title: 'Editar País' }
    },
    {
        path: ':id/view',
        component: PaisDetailComponent,
        data: { title: 'Visualizar País' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(paisRoutes)],
    exports: [RouterModule]
})
export class PaisRoutingModule {
}

