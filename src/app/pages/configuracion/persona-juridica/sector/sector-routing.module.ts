import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectorDetailComponent } from './detail/sector-detail.component';
import { SectorFormComponent } from './form/sector-form.component';
import { SectorTableComponent } from './table/sector-table.component';


const sectorRoutes: Routes = [

    {
        path: '',
        component: SectorTableComponent,
        data: { title: 'Sectores' }
    },
    {
        path: 'add',
        component: SectorFormComponent,
        data: { title: 'Crear Sector' }
    },
    {
        path: ':id/edit',
        component: SectorFormComponent,
        data: { title: 'Editar Sector' }
    },
    {
        path: ':id/view',
        component: SectorDetailComponent,
        data: { title: 'Visualizar Sector' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(sectorRoutes)],
    exports: [RouterModule]
})
export class SectorRoutingModule {
}

