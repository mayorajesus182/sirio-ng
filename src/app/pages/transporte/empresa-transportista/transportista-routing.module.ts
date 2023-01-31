import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { AvaluoTransporteTableComponent } from './avaluos/table/avaluo-transporte-table.component';
import { TransportistaDetailComponent } from './detail/transportista-detail.component';
import { EmpleadoTransporteTableComponent } from './empleados/table/empleado-transporte-table.component';
import { TransportistaFormComponent } from './form/transportista-form.component';
import { MaterialTransporteTableComponent } from './materiales/table/material-transporte-table.component';
import { TransportistaTableComponent } from './table/transportista-table.component';
import { TerminosTransporteFormComponent } from './terminos/form/terminos-transporte-form.component';
import { ViajeTransporteTableComponent } from './viajes/table/viaje-transporte-table.component';
import { ActualizarSaldoTransportistaFormComponent } from './saldos/form/actualizar-saldo-transportista-form.component';
import { ConsultarSaldoTransportistaFormComponent } from './consultar-saldos/form/consultar-saldo-transportista-form.component';


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
        path: ':id/appraisal',
        component: AvaluoTransporteTableComponent,
        data: { title: 'Avaluos' }
    },   
    {
        path: ':id/material',
        component: MaterialTransporteTableComponent,
        data: { title: 'Materiales' }
    },  
    {
        path: ':id/trip',
        component: ViajeTransporteTableComponent,
        data: { title: 'Viajes' }
    },  
    {
        path: ':id/terms',
        component: TerminosTransporteFormComponent,
        data: { title: 'Términos y Condiciones' }
    },  
    {
        path: ':id/view',
        component: TransportistaDetailComponent,
        data: { title: 'Visualizar Transportista' }
    },
    {
        path: ':id/balance',
        component: ActualizarSaldoTransportistaFormComponent,
        data: { title: 'Saldo del Centro de Acopio' }
    },
    {
        path: ':id/check',
        component: ConsultarSaldoTransportistaFormComponent,
        data: { title: 'Consultar Saldo del Centro de Acopio' }
    },
];


@NgModule({
    imports: [RouterModule.forChild(transportistaRoutes)],
    exports: [RouterModule]
})
export class TransportistaRoutingModule {
}

