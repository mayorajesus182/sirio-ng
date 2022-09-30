import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const divisaRoutes: Routes = [

    {
        path: 'moneda',
        data: { title: 'Moneda' },
        loadChildren: () => import('./moneda/moneda.module').then(m => m.MonedaModule),
    },

     {
        path: 'cono-monetario',
        data: { title: 'Cono Monetario' },
        loadChildren: () => import('./cono-monetario/cono-monetario.module').then(m => m.ConoMonetarioModule),
    }
        

];


@NgModule({
    imports: [RouterModule.forChild(divisaRoutes)],
    exports: [RouterModule]
})
export class DivisaRoutingModule {
}

