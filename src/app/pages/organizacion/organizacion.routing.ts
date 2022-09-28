import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const organizacionRoutes: Routes = [
    {
        path: 'agencia',
        data: { title: 'agency.table' },
        loadChildren: () => import('./agencia/agencia.module').then(m => m.AgenciaModule),
    },

    {
        path: 'institucion',
        data: { title: 'institucion' },
        loadChildren: () => import('./institucion/institucion.module').then(m => m.InstitucionModule),
    },

];



@NgModule({
    imports: [RouterModule.forChild(organizacionRoutes)],
    exports: [RouterModule]
})
export class OrganizacionRoutingModule {
}
