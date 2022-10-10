import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaseEfectivoDetailComponent } from './detail/pase-efectivo-detail.component';
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
    {
        path: ':id/view',
        component: PaseEfectivoDetailComponent,
        data: { title: 'Visualizar Pase de Efectivo' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(paseEfectivoRoutes)],
    exports: [RouterModule]
})
export class PaseEfectivoRoutingModule {
}

