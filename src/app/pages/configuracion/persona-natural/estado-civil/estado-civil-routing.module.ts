import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoCivilDetailComponent } from './detail/estado-civil-detail.component';
import { EstadoCivilFormComponent } from './form/estado-civil-form.component';
import { EstadoCivilTableComponent } from './table/estado-civil-table.component';


const estadoCivilRoutes: Routes = [

    {
        path: '',
        component: EstadoCivilTableComponent,
        data: { title: 'Estados Civiles' }
    },
    {
        path: 'add',
        component: EstadoCivilFormComponent,
        data: { title: 'Crear Estado Civil' }
    },
    {
        path: ':id/edit',
        component: EstadoCivilFormComponent,
        data: { title: 'Editar Estado Civil' }
    },
    {
        path: ':id/view',
        component: EstadoCivilDetailComponent,
        data: { title: 'Visualizar Estado Civil' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(estadoCivilRoutes)],
    exports: [RouterModule]
})
export class EstadoCivilRoutingModule {
}

