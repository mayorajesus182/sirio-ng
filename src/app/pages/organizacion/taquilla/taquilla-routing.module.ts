import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaquillaDetailComponent } from './detail/taquilla-detail.component';
import { TaquillaFormComponent } from './form/taquilla-form.component';
import { TaquillaTableComponent } from './table/taquilla-table.component';


const taquillaRoutes: Routes = [

    {
        path: '',
        component: TaquillaTableComponent,
        data: { title: 'Taquillas' }
    },
    {
        path: 'add',
        component: TaquillaFormComponent,
        data: { title: 'Crear Taquilla' }
    },
    {
        path: ':id/edit',
        component: TaquillaFormComponent,
        data: { title: 'Editar Taquilla' }
    },
    {
        path: ':id/view',
        component: TaquillaDetailComponent,
        data: { title: 'Visualizar Taquilla' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(taquillaRoutes)],
    exports: [RouterModule]
})
export class TaquillaRoutingModule {
}

