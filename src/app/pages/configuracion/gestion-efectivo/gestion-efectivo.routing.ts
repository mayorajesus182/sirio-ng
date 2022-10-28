import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const gestionEfectivoRoutes: Routes = [

    {
        path: 'zona',
        data: { title: 'zone.table' },
        loadChildren: () => import('./zona/zona.module').then(m => m.ZonaModule),
    },
    {
        path: 'region',
        data: { title: 'region.table' },
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
    },
   

];


@NgModule({
    imports: [RouterModule.forChild(gestionEfectivoRoutes)],
    exports: [RouterModule]
})
export class GestionEfectivoRoutingModule {
}
