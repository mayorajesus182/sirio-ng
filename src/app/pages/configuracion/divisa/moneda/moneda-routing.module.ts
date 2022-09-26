import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonedaDetailComponent } from './detail/moneda-detail.component';
import { MonedaFormComponent } from './form/moneda-form.component';
import { MonedaTableComponent } from './table/moneda-table.component';


const monedaRoutes: Routes = [

    {
        path: '',
        component: MonedaTableComponent,
        data: { title: 'Moneda' }
    },
    {
        path: 'add',
        component: MonedaFormComponent,
        data: { title: 'Crear Moneda' }
    },
    {
        path: ':id/edit',
        component: MonedaFormComponent,
        data: { title: 'Editar Moneda' }
    },
    {
        path: ':id/view',
        component: MonedaDetailComponent,
        data: { title: 'Visualizar Moneda' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(monedaRoutes)],
    exports: [RouterModule]
})
export class MonedaRoutingModule {
}

