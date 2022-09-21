import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const organizacionRoutes: Routes = [
    {
        path: 'agencia',
        data: { title: 'agency.table' },
        loadChildren: () => import('./agencia/agencia.module').then(m => m.AgenciaModule),
    },

];



@NgModule({
    imports: [RouterModule.forChild(organizacionRoutes)],
    exports: [RouterModule]
})
export class OrganizacionRoutingModule {
}
