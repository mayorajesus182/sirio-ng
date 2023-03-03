import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlazoFijoDetailComponent } from './consultar/detail/plazo-fijo-detail.component';
import { PlazoFijoTableComponent } from './consultar/table/plazo-fijo-table.component';
import { PlazoFijoFormComponent } from './registrar/form/plazo-fijo-form.component';


const plazoFijoRoutes: Routes = [

    {
        path: 'consultar',
        component: PlazoFijoTableComponent,
        data: { title: 'ósitos de Plazo Fijo' }
    },
    {
        path: 'registrar',
        component: PlazoFijoFormComponent,
        data: { title: 'Crear Depósito de Plazo Fijo' }
    },
    {
        path: ':id/view',
        component: PlazoFijoDetailComponent,
        data: { title: 'Visualizar ósito de Plazo Fijo' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(plazoFijoRoutes)],
    exports: [RouterModule]
})
export class PlazoFijoRoutingModule {
}

