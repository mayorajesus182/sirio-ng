import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepPlazoFijoDetailComponent } from './detail/dep-plazo-fijo-detail.component';
import { DepPlazoFijoTableComponent } from './table/dep-plazo-fijo-table.component';
import { DepPlazoFijoFormComponent } from './form/dep-plazo-fijo-form.component';


const depPlazoFijoRoutes: Routes = [

    {
        path: '',
        component: DepPlazoFijoTableComponent,
        data: { title: 'Depósitos de Plazo Fijo' }
    },
    {
        path: 'add',
        component: DepPlazoFijoFormComponent,
        data: { title: 'Crear Depósito de Plazo Fijo' }
    },
    {
        path: ':id/edit',
        component: DepPlazoFijoFormComponent,
        data: { title: 'Editar Depósito de Plazo Fijo' }
    },
    {
        path: ':id/view',
        component: DepPlazoFijoDetailComponent,
        data: { title: 'Visualizar Depósito de Plazo Fijo' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(depPlazoFijoRoutes)],
    exports: [RouterModule]
})
export class DepPlazoFijoRoutingModule {
}

