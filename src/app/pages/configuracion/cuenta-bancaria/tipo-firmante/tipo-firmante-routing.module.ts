import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoFirmanteDetailComponent } from './detail/tipo-firmante-detail.component';
import { TipoFirmanteFormComponent } from './form/tipo-firmante-form.component';
import { TipoFirmanteTableComponent } from './table/tipo-firmante-table.component';



const tipoFirmanteRoutes: Routes = [

    {
        path: '',
        component: TipoFirmanteTableComponent,
        data: { title: 'Tipos de Firmante' }
    },
    {
        path: 'add',
        component: TipoFirmanteFormComponent,
        data: { title: 'Crear Tipo de Firmante' }
    },
    {
        path: ':id/edit',
        component: TipoFirmanteFormComponent,
        data: { title: 'Editar Tipo de Firmante' }
    },
    {
        path: ':id/view',
        component: TipoFirmanteDetailComponent,
        data: { title: 'Visualizar Tipo de Firmante' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoFirmanteRoutes)],
    exports: [RouterModule]
})
export class TipoFirmanteRoutingModule {
}

