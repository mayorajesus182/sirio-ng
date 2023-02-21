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
        data: { title: 'Depósito' },
        loadChildren: () => import('./deposito/deposito.module').then(m => m.DepositoModule),
    },
    // {
    //     path: 'nota',
    //     data: { title: 'Nota de Debito / Credito' },
    //     loadChildren: () => import('./nota/nota.module').then(m => m.NotaModule),
    // },
    {
        path: 'tarjeta-debito',
        data: { title: 'Tarjeta de Débito' },
        loadChildren: () => import('./tarjeta-debito/tarjeta-debito.module').then(m => m.TarjetaDebitoModule),
    }
    
];



@NgModule({
    imports: [RouterModule.forChild(taquillaRoutes)],
    exports: [RouterModule]
})
export class TaquillaRoutingModule {
}
