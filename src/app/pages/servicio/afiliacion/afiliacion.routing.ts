import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const afiliacionRoutingModuleRoutes: Routes = [

    {
        path: 'pago-proveedores',
        data: { title: 'pago-proveedores' },
        loadChildren: () => import('./pago-proveedores/pagoproveedores.module').then(m => m.pagoproveedoresModule),
    },
 

];

@NgModule({
    imports: [RouterModule.forChild(afiliacionRoutingModuleRoutes)],
    exports: [RouterModule]
})
export class afiliacionRoutingModule {
}