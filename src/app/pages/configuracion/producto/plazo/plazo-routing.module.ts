import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlazoDetailComponent } from './detail/plazo-detail.component';
import { PlazoFormComponent } from './form/plazo-form.component';
import { PlazoTableComponent } from './table/plazo-table.component';



const plazoRoutes: Routes = [

    {
        path: '',
        component: PlazoTableComponent,
        data: { title: 'Plazos' }
    },
    {
        path: 'add',
        component: PlazoFormComponent,
        data: { title: 'Crear Plazo' }
    },
    {
        path: ':id/edit',
        component: PlazoFormComponent,
        data: { title: 'Editar Plazo' }
    },
    {
        path: ':id/view',
        component: PlazoDetailComponent,
        data: { title: 'Visualizar Plazo' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(plazoRoutes)],
    exports: [RouterModule]
})
export class PlazoRoutingModule {
}

