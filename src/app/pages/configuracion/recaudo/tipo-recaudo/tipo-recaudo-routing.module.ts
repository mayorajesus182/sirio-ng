import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoRecaudoTableComponent } from './table/tipo-recaudo-table.component';
import { TipoRecaudoFormComponent } from './form/tipo-recaudo-form.component';
import { TipoRecaudoDetailComponent } from './detail/tipo-recaudo-detail.component';


const tipoRecaudoRoutes: Routes = [

    {
        path: '',
        component: TipoRecaudoTableComponent,
        data: { title: 'Tipos de Recaudo' }
    },
    {
        path: 'add',
        component: TipoRecaudoFormComponent,
        data: { title: 'Crear Tipo de Recaudo' }
    },
    {
        path: ':id/edit',
        component: TipoRecaudoFormComponent,
        data: { title: 'Editar Tipo de Recaudo' }
    },
    {
        path: ':id/view',
        component: TipoRecaudoDetailComponent,
        data: { title: 'Visualizar Tipo de Recaudo' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoRecaudoRoutes)],
    exports: [RouterModule]
})
export class TipoRecaudoRoutingModule {
}

