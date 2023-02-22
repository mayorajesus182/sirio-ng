import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromedioTransaccionDetailComponent } from './detail/promedio-transaccion-detail.component';
import { PromedioTransaccionFormComponent } from './form/promedio-transaccion-form.component';
import { PromedioTransaccionTableComponent } from './table/promedio-transaccion-table.component';


const tipoProductoRoutes: Routes = [

    {
        path: '',
        component: PromedioTransaccionTableComponent,
        data: { title: 'Promedios de Transacciones' }
    },
    {
        path: 'add',
        component: PromedioTransaccionFormComponent,
        data: { title: 'Crear Promedio de Transacción' }
    },
    {
        path: ':id/edit',
        component: PromedioTransaccionFormComponent,
        data: { title: 'Editar Promedio de Transacción' }
    },
    {
        path: ':id/view',
        component: PromedioTransaccionDetailComponent,
        data: { title: 'Visualizar Promedio de Transacción' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoProductoRoutes)],
    exports: [RouterModule]
})
export class PromedioTransaccionRoutingModule {
}

