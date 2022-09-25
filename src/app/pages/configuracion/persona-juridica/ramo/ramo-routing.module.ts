import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RamoDetailComponent } from './detail/ramo-detail.component';
import { RamoFormComponent } from './form/ramo-form.component';
import { RamoTableComponent } from './table/ramo-table.component';


const ramoRoutes: Routes = [

    {
        path: '',
        component: RamoTableComponent,
        data: { title: 'Ramos' }
    },
    {
        path: 'add',
        component: RamoFormComponent,
        data: { title: 'Crear Ramo' }
    },
    {
        path: ':id/edit',
        component: RamoFormComponent,
        data: { title: 'Editar Ramo' }
    },
    {
        path: ':id/view',
        component: RamoDetailComponent,
        data: { title: 'Visualizar Ramo' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(ramoRoutes)],
    exports: [RouterModule]
})
export class RamoRoutingModule {
}

