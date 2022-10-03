import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoRelacionDetailComponent } from './detail/tipo-relacion-detail.component';
import { TipoRelacionFormComponent } from './form/tipo-relacion-form.component';
import { TipoRelacionTableComponent } from './table/tipo-relacion-table.component';


const tipoRelacionRoutes: Routes = [

    {
        path: '',
        component: TipoRelacionTableComponent,
        data: { title: 'Tipos de Relacions' }
    },
    {
        path: 'add',
        component: TipoRelacionFormComponent,
        data: { title: 'Crear Tipo de Relacion' }
    },
    {
        path: ':id/edit',
        component: TipoRelacionFormComponent,
        data: { title: 'Editar Tipo de Relacion' }
    },
    {
        path: ':id/view',
        component: TipoRelacionDetailComponent,
        data: { title: 'Visualizar Tipo de Relacion' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoRelacionRoutes)],
    exports: [RouterModule]
})
export class TipoRelacionRoutingModule {
}

