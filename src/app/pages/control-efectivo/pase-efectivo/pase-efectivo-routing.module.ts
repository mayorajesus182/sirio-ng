import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaseEfectivoFormComponent } from './form/pase-efectivo-form.component';
import { PaseEfectivoTableComponent } from './table/pase-efectivo-table.component';


const paseEfectivoRoutes: Routes = [

    {
        path: '',
        component: PaseEfectivoTableComponent,
        data: { title: 'Pases de Efectivo' }
    },
    {
        path: 'add',
        component: PaseEfectivoFormComponent,
        data: { title: 'Crear Pase de Efectivo' }
    },
    // {
    //     path: ':id/edit',
    //     component: ConstruccionFormComponent,
    //     data: { title: 'Editar Construccion' }
    // },
    // {
    //     path: ':id/view',
    //     component: ConstruccionDetailComponent,
    //     data: { title: 'Visualizar Construccion' }
    // }

];


@NgModule({
    imports: [RouterModule.forChild(paseEfectivoRoutes)],
    exports: [RouterModule]
})
export class PaseEfectivoRoutingModule {
}

