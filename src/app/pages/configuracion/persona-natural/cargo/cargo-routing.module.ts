import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargoDetailComponent } from './detail/cargo-detail.component';
import { CargoFormComponent } from './form/cargo-form.component';
import { CargoTableComponent } from './table/cargo-table.component';


const cargoRoutes: Routes = [

    {
        path: '',
        component: CargoTableComponent,
        data: { title: 'Cargos' }
    },
    {
        path: 'add',
        component: CargoFormComponent,
        data: { title: 'Crear Cargo' }
    },
    {
        path: ':id/edit',
        component: CargoFormComponent,
        data: { title: 'Editar Cargo' }
    },
    {
        path: ':id/view',
        component: CargoDetailComponent,
        data: { title: 'Visualizar Cargo' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(cargoRoutes)],
    exports: [RouterModule]
})
export class CargoRoutingModule {
}

