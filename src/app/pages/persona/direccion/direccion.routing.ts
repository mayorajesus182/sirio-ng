import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const direccionRoutes: Routes = [

    {
        path: 'direccion',
        data: { title: 'Direccion' },
        loadChildren: () => import('./direccion.module').then(m => m.DireccionModule),
    },

];

@NgModule({
    imports: [RouterModule.forChild(direccionRoutes)],
    exports: [RouterModule]
})
export class DireccionRoutingModule {
}