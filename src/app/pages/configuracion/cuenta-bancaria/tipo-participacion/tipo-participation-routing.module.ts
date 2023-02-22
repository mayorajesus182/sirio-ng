import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoParticipacionDetailComponent } from './detail/tipo-participacion-detail.component';
import { TipoParticipacionFormComponent } from './form/tipo-participacion-form.component';
import { TipoParticipacionTableComponent } from './table/tipo-participacion-table.component';



const tipoParticipacionRoutes: Routes = [

    {
        path: '',
        component: TipoParticipacionTableComponent,
        data: { title: 'Tipos de Participación' }
    },
    {
        path: 'add',
        component: TipoParticipacionFormComponent,
        data: { title: 'Crear Tipo de Participación' }
    },
    {
        path: ':id/edit',
        component: TipoParticipacionFormComponent,
        data: { title: 'Editar Tipo de Participación' }
    },
    {
        path: ':id/view',
        component: TipoParticipacionDetailComponent,
        data: { title: 'Visualizar Tipo de Participación' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoParticipacionRoutes)],
    exports: [RouterModule]
})
export class TipoParticipacionRoutingModule {
}

