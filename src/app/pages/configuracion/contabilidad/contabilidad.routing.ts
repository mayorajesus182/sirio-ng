import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const contabilidadRoutes: Routes = [

    {
        path: 'cuenta-contable',
        data: { title: 'Cuenta Contable' },
        loadChildren: () => import('./cuenta-contable/cuenta-contable.module').then(m => m.CuentaContableModule),
    },   
];

@NgModule({
    imports: [RouterModule.forChild(contabilidadRoutes)],
    exports: [RouterModule]
})
export class ContabilidadRoutingModule {
}
