import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoSubproductoDetailComponent } from './detail/tipo-subproducto-detail.component';
import { TipoSubproductoFormComponent } from './form/tipo-subproducto-form.component';
import { TipoSubproductoTableComponent } from './table/tipo-subproducto-table.component';



const tipoSubproductoRoutes: Routes = [

    {
        path: '',
        component: TipoSubproductoTableComponent,
        data: { title: 'Tipos de Subproducto' }
    },
    {
        path: 'add',
        component: TipoSubproductoFormComponent,
        data: { title: 'Crear Tipo de Subproducto' }
    },
    {
        path: ':id/edit',
        component: TipoSubproductoFormComponent,
        data: { title: 'Editar Tipo de Subproducto' }
    },
    {
        path: ':id/view',
        component: TipoSubproductoDetailComponent,
        data: { title: 'Visualizar Tipo de Subproducto' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoSubproductoRoutes)],
    exports: [RouterModule]
})
export class TipoSubproductoRoutingModule {
}

