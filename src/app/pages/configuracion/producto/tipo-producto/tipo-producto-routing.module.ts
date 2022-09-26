import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoProductoDetailComponent } from './detail/tipo-producto-detail.component';
import { TipoProductoFormComponent } from './form/tipo-producto-form.component';
import { TipoProductoTableComponent } from './table/tipo-producto-table.component';


const tipoProductoRoutes: Routes = [

    {
        path: '',
        component: TipoProductoTableComponent,
        data: { title: 'Tipos de Productos' }
    },
    {
        path: 'add',
        component: TipoProductoFormComponent,
        data: { title: 'Crear Tipo de Producto' }
    },
    {
        path: ':id/edit',
        component: TipoProductoFormComponent,
        data: { title: 'Editar Tipo de Producto' }
    },
    {
        path: ':id/view',
        component: TipoProductoDetailComponent,
        data: { title: 'Visualizar Tipo de Producto' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoProductoRoutes)],
    exports: [RouterModule]
})
export class TipoProductoRoutingModule {
}

