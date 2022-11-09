import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const controlEfectivoRoutes: Routes = [
    {
        path: 'pase-efectivo',
        data: { title: 'Pases de Efectivo' },
        loadChildren: () => import('./pase-efectivo/pase-efectivo.module').then(m => m.PaseEfectivoModule),
    },
    {
        path: 'arqueo-atm',
        data: { title: 'Arqueos de ATM' },
        loadChildren: () => import('./arqueo-atm/arqueo-atm.module').then(m => m.ArqueoAtmModule),
    },
    {
        path: 'cierre-agencia',
        data: { title: 'Cierre de Agencia' },
        loadChildren: () => import('./cierre-agencia/cierre-agencia.module').then(m => m.CierreAgenciaModule),
    },
    {
        path: 'pase-boveda',
        data: { title: 'Pases a Bóveda' },
        loadChildren: () => import('./pase-boveda/pase-boveda.module').then(m => m.PaseABovedaModule),
    },
    {
        path: 'cierre-taquilla',
        data: { title: 'Pases a Bóveda' },
        loadChildren: () => import('./cierre-taquilla/cierre-taquilla.module').then(m => m.CierreTaquillaModule),
    },
];



@NgModule({
    imports: [RouterModule.forChild(controlEfectivoRoutes)],
    exports: [RouterModule]
})
export class ControlEfectivoRoutingModule {
}
