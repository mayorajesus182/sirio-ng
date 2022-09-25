import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MunicipioDetailComponent } from './detail/municipio-detail.component';
import { MunicipioFormComponent } from './form/municipio-form.component';
import { MunicipioTableComponent } from './table/municipio-table.component';


const municipioRoutes: Routes = [

    {
        path: '',
        component: MunicipioTableComponent,
        data: { title: 'Municipios' }
    },
    {
        path: 'add',
        component: MunicipioFormComponent,
        data: { title: 'Crear Municipio' }
    },
    {
        path: ':id/edit',
        component: MunicipioFormComponent,
        data: { title: 'Editar Municipio' }
    },
    {
        path: ':id/view',
        component: MunicipioDetailComponent,
        data: { title: 'Visualizar Municipio' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(municipioRoutes)],
    exports: [RouterModule]
})
export class MunicipioRoutingModule {
}

