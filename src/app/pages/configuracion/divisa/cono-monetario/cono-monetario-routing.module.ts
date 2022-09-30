import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConoMonetarioDetailComponent } from './detail/cono-monetario-detail.component';
import { ConoMonetarioFormComponent } from './form/cono-monetario-form.component';
import { ConoMonetarioTableComponent } from './table/cono-monetario-table.component';



const conomonetarioRoutes: Routes = [

    {
        path: '',
        component: ConoMonetarioTableComponent,
        data: { title: 'Cono Monetario' }
    },
    {
        path: 'add',
        component: ConoMonetarioFormComponent,
        data: { title: 'Crear Cono Monetario' }
    },
    {
        path: ':id/edit',
        component: ConoMonetarioFormComponent,
        data: { title: 'Editar Cono Monetario' }
    },
    {
        path: ':id/view',
        component: ConoMonetarioDetailComponent,
        data: { title: 'Visualizar Cono Monetario' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(conomonetarioRoutes)],
    exports: [RouterModule]
})
export class ConoMonetarioRoutingModule {
}

