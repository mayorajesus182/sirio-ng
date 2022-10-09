import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const organizacionRoutes: Routes = [
    {
        path: 'institucion',
        data: { title: 'institucion' },
        loadChildren: () => import('./institucion/institucion.module').then(m => m.InstitucionModule),
    },
    {
        path: 'agencia',
        data: { title: 'agency.table' },
        loadChildren: () => import('./agencia/agencia.module').then(m => m.AgenciaModule),
    },
    {
        path: 'taquilla',
        data: { title: 'boxOffice.table' },
        loadChildren: () => import('./taquilla/taquilla.module').then(m => m.TaquillaModule),
    },
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
    imports: [RouterModule.forChild(organizacionRoutes)],
    exports: [RouterModule]
})
export class OrganizacionRoutingModule {
}
