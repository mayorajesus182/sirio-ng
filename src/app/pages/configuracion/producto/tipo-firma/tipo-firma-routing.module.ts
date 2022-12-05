import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoFirmaDetailComponent } from './detail/tipo-firma-detail.component';
import { TipoFirmaFormComponent } from './form/tipo-firma-form.component';
import { TipoFirmaTableComponent } from './table/tipo-firma-table.component';



const tipoFirmaRoutes: Routes = [

    {
        path: '',
        component: TipoFirmaTableComponent,
        data: { title: 'Tipos de Firma' }
    },
    {
        path: 'add',
        component: TipoFirmaFormComponent,
        data: { title: 'Crear Tipo de Firma' }
    },
    {
        path: ':id/edit',
        component: TipoFirmaFormComponent,
        data: { title: 'Editar Tipo de Firma' }
    },
    {
        path: ':id/view',
        component: TipoFirmaDetailComponent,
        data: { title: 'Visualizar Tipo de Firma' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoFirmaRoutes)],
    exports: [RouterModule]
})
export class TipoFirmaRoutingModule {
}

