import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportistaDetailComponent } from './detail/transportista-detail.component';
import { EmpleadoTransporteTableComponent } from './empleados/table/empleado-transporte-table.component';
import { TransportistaFormComponent } from './form/transportista-form.component';
import { TransportistaTableComponent } from './table/transportista-table.component';


const transportistaRoutes: Routes = [

    {
        path: '',
        component: TransportistaTableComponent,
        data: { title: 'Transportistas' }
    },
    {
        path: 'add',
        component: TransportistaFormComponent,
        data: { title: 'Crear Transportista' }
    },
    {
        path: ':id/edit',
        component: TransportistaFormComponent,
        data: { title: 'Editar Transportista' }
    },
    {
        path: ':id/employee',
        component: EmpleadoTransporteTableComponent,
        data: { title: 'Empleados' }
    },
    {
        path: ':id/view',
        component: TransportistaDetailComponent,
        data: { title: 'Visualizar Transportista' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(transportistaRoutes)],
    exports: [RouterModule]
})
export class TransportistaRoutingModule {
}

