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
        loadChildren: () => import('./material/material.module').then(m => m.MaterialTransporteModule),
    },
    {
        path: 'viaje',
        data: { title: 'trip.table' },
        loadChildren: () => import('./viaje/viaje.module').then(m => m.ViajeModule),
    },

];



@NgModule({
    imports: [RouterModule.forChild(transporteRoutes)],
    exports: [RouterModule]
})
export class TransporteRoutingModule {
}
