import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialDetailComponent } from './detail/material-detail.component';
import { MaterialFormComponent } from './form/material-form.component';
import { MaterialTableComponent } from './table/material-table.component';


const materialRoutes: Routes = [

    {
        path: '',
        component: MaterialTableComponent,
        data: { title: 'Materiales' }
    },
    {
        path: 'add',
        component: MaterialFormComponent,
        data: { title: 'Crear Material' }
    },
    {
        path: ':id/edit',
        component: MaterialFormComponent,
        data: { title: 'Editar Material' }
    },
    {
        path: ':id/view',
        component: MaterialDetailComponent,
        data: { title: 'Visualizar Material' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(materialRoutes)],
    exports: [RouterModule]
})
export class MaterialRoutingModule {
}

