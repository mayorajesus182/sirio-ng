import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionDetailComponent } from './detail/region-detail.component';
import { RegionFormComponent } from './form/region-form.component';
import { RegionTableComponent } from './table/region-table.component';



const regionRoutes: Routes = [

    {
        path: '',
        component: RegionTableComponent,
        data: { title: 'Regiones' }
    },
    {
        path: 'add',
        component: RegionFormComponent,
        data: { title: 'Crear Región' }
    },
    {
        path: ':id/edit',
        component: RegionFormComponent,
        data: { title: 'Editar Región' }
    },
    {
        path: ':id/view',
        component: RegionDetailComponent,
        data: { title: 'Visualizar Región' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(regionRoutes)],
    exports: [RouterModule]
})
export class RegionRoutingModule {
}

