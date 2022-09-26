import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NivelEstudioDetailComponent } from './detail/nivel-estudio-detail.component';
import { NivelEstudioFormComponent } from './form/nivel-estudio-form.component';
import { NivelEstudioTableComponent } from './table/nivel-estudio-table.component';


const tipoReferenciaRoutes: Routes = [

    {
        path: '',
        component: NivelEstudioTableComponent,
        data: { title: 'Niveles de Estudios' }
    },
    {
        path: 'add',
        component: NivelEstudioFormComponent,
        data: { title: 'Crear Nivel de Estudio' }
    },
    {
        path: ':id/edit',
        component: NivelEstudioFormComponent,
        data: { title: 'Editar Nivel de Estudio' }
    },
    {
        path: ':id/view',
        component: NivelEstudioDetailComponent,
        data: { title: 'Visualizar Nivel de Estudio' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(tipoReferenciaRoutes)],
    exports: [RouterModule]
})
export class NivelEstudioRoutingModule {
}

