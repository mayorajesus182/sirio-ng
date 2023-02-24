import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const plazoFijoRoutes: Routes = [

    {
        path: 'plazo',
        data: { title: 'Plazos' },
        loadChildren: () => import('./plazo-dpf/plazo-dpf.module').then(m => m.PlazoDPFModule),
    },
    {
        path: 'tasa',
        data: { title: 'Tasas' },
        loadChildren: () => import('./tasa-dpf/tasa-dpf.module').then(m => m.TasaDPFModule),
    },
];


@NgModule({
    imports: [RouterModule.forChild(plazoFijoRoutes)],
    exports: [RouterModule]
})
export class PlazoFijoRoutingModule {
}
