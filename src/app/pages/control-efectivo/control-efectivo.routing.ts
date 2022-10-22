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
];



@NgModule({
    imports: [RouterModule.forChild(controlEfectivoRoutes)],
    exports: [RouterModule]
})
export class ControlEfectivoRoutingModule {
}
