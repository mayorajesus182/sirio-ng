import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaEspecialDetailComponent } from './detail/categoria-especial-detail.component';
import { CategoriaEspecialFormComponent } from './form/categoria-especial-form.component';
import { CategoriaEspecialTableComponent } from './table/categoria-especial-table.component';


const categoriaEspecialRoutes: Routes = [

    {
        path: '',
        component: CategoriaEspecialTableComponent,
        data: { title: 'Categoría Especiales' }
    },
    {
        path: 'add',
        component: CategoriaEspecialFormComponent,
        data: { title: 'Crear Categoría Especial' }
    },
    {
        path: ':id/edit',
        component: CategoriaEspecialFormComponent,
        data: { title: 'Editar Categoría Especial' }
    },
    {
        path: ':id/view',
        component: CategoriaEspecialDetailComponent,
        data: { title: 'Visualizar Categoría Especial' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(categoriaEspecialRoutes)],
    exports: [RouterModule]
})
export class CategoriaEspecialRoutingModule {
}

