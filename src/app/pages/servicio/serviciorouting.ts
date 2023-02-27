import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const servicioRoutes: Routes = [

    {
        path: 'afiliacion',
        data: { title: 'afiliacion' },
        loadChildren: () => import('./afiliacion/afiliacion.module').then(m => m.afiliacionModule),
    },


];

@NgModule({
    imports: [RouterModule.forChild(servicioRoutes)],
    exports: [RouterModule]
})
export class servicioRoutingModule {
}