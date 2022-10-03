import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViajeDetailComponent } from './detail/viaje-detail.component';
import { ViajeFormComponent } from './form/viaje-form.component';
import { ViajeTableComponent } from './table/viaje-table.component';


const viajeRoutes: Routes = [

    {
        path: '',
        component: ViajeTableComponent,
        data: { title: 'Viajes' }
    },
    {
        path: 'add',
        component: ViajeFormComponent,
        data: { title: 'Crear Viaje' }
    },
    {
        path: ':id/edit',
        component: ViajeFormComponent,
        data: { title: 'Editar Viaje' }
    },
    {
        path: ':id/view',
        component: ViajeDetailComponent,
        data: { title: 'Visualizar Viaje' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(viajeRoutes)],
    exports: [RouterModule]
})
export class ViajeRoutingModule {
}

