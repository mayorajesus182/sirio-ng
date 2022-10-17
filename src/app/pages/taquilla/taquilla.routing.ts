import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const taquillaRoutes: Routes = [
    {
        path: 'retiro',
        data: { title: 'Retiro' },
        loadChildren: () => import('./retiro/retiro.module').then(m => m.RetiroModule),
    },
    {
        path: 'deposito',
        data: { title: 'Deposito' },
        loadChildren: () => import('./deposito/deposito.module').then(m => m.DepositoModule),
    },
    {
        path: 'pase-boveda',
        data: { title: 'Pases a Bóveda' },
        loadChildren: () => import('./pase-boveda/pase-boveda.module').then(m => m.PaseABovedaModule),
    },
];



@NgModule({
    imports: [RouterModule.forChild(taquillaRoutes)],
    exports: [RouterModule]
})
export class TaquillaRoutingModule {
}
