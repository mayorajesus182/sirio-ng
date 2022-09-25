import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDireccionDetailComponent } from './detail/tipo-direccion-detail.component';
import { TipoDireccionFormComponent } from './form/tipo-direccion-form.component';
import { TipoDireccionTableComponent } from './table/tipo-direccion-table.component';


const tipoDireccionRoutes: Routes = [

    {
        path: '',
        component: TipoDireccionTableComponent,
        data: { title: 'Tipo de Direcciones' }
    },
    {
        path: 'add',
        component: TipoDireccionFormComponent,
        data: { title: 'Crear Tipo de Dirección' }
    },
    {
        path: ':id/edit',
        component: TipoDireccionFormComponent,
        data: { title: 'Editar Tipo de Dirección' }
    },
    {
        path: ':id/view',
        component: TipoDireccionDetailComponent,
        data: { title: 'Visualizar Tipo de Dirección' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoDireccionRoutes)],
    exports: [RouterModule]
})
export class TipoDireccionRoutingModule {
}

