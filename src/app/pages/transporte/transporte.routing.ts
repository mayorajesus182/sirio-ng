import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const transporteRoutes: Routes = [
    {
        path: 'transportista',
        data: { title: 'carrierCompany.table' },
        loadChildren: () => import('./empresa-transportista/transportista.module').then(m => m.TransportistaModule),
    },
    {
        path: 'avaluo',
        data: { title: 'appraisal.table' },
        loadChildren: () => import('./avaluo/avaluo.module').then(m => m.AvaluoModule),
    },
    {
        path: 'material',
        data: { title: 'material.table' },
        loadChildren: () => import('./material/material-transporte.module').then(m => m.MaterialTransporteModule),
    },
    {
        path: 'viaje',
        data: { title: 'trip.table' },
        loadChildren: () => import('./viaje/viaje.module').then(m => m.ViajeModule),
    },
    {
        path: 'reporte-empresa-transporte',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-empresa/reporte-empresa.module').then(m => m.ReporteEmpresaModule),
    },
    {
        path: 'reporte-empleado-transporte',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-empleado/reporte-empleado.module').then(m => m.ReporteEmpleadoModule),
    },
    {
        path: 'reporte-avaluo-transporte',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-costo-avaluo/reporte-costo-avaluo.module').then(m => m.ReporteCostoAvaluoModule),
    },
    {
        path: 'reporte-material-transporte',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-costo-material/reporte-costo-material.module').then(m => m.ReporteCostoMaterialModule),
    },
    {
        path: 'reporte-viaje-transporte',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-costo-viaje/reporte-costo-viaje.module').then(m => m.ReporteCostoViajeModule),
    },
    {
        path: 'reporte-avaluo',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-avaluo/reporte-avaluo.module').then(m => m.ReporteAvaluoModule),
    },
    {
        path: 'reporte-material',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-material/reporte-material.module').then(m => m.ReporteMaterialModule),
    },
    {
        path: 'reporte-viaje',
        data: { title: 'trip.table' },
        loadChildren: () => import('./reports/reporte-viaje/reporte-viaje.module').then(m => m.ReporteViajeModule),
    },

];



@NgModule({
    imports: [RouterModule.forChild(transporteRoutes)],
    exports: [RouterModule]
})
export class TransporteRoutingModule {
}
