import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const divisaRoutes: Routes = [

    {
        path: 'moneda',
        data: { title: 'Moneda' },
        loadChildren: () => import('./moneda/moneda.module').then(m => m.MonedaModule),
    }

];


@NgModule({
    imports: [RouterModule.forChild(divisaRoutes)],
    exports: [RouterModule]
})
export class DivisaRoutingModule {
}

