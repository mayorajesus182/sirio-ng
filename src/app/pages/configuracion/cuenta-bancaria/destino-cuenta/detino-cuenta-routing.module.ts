import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinoCuentaDetailComponent } from './detail/destino-cuenta-detail.component';
import { DestinoCuentaFormComponent } from './form/destino-cuenta-form.component';
import { DestinoCuentaTableComponent } from './table/destino-cuenta-table.component';



const destinoCuentaRoutes: Routes = [

    {
        path: '',
        component: DestinoCuentaTableComponent,
        data: { title: 'Destinos de Cuenta' }
    },
    {
        path: 'add',
        component: DestinoCuentaFormComponent,
        data: { title: 'Crear Destino de Cuenta' }
    },
    {
        path: ':id/edit',
        component: DestinoCuentaFormComponent,
        data: { title: 'Editar Destino de Cuenta' }
    },
    {
        path: ':id/view',
        component: DestinoCuentaDetailComponent,
        data: { title: 'Visualizar Destino de Cuenta' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(destinoCuentaRoutes)],
    exports: [RouterModule]
})
export class DestinoCuentaRoutingModule {
}

