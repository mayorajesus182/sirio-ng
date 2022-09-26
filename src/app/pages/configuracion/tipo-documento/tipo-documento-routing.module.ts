import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDocumentoDetailComponent } from './detail/tipo-documento-detail.component';
import { TipoDocumentoFormComponent } from './form/tipo-documento-form.component';
import { TipoDocumentoTableComponent } from './table/tipo-documento-table.component';


const tipoDocumentoRoutes: Routes = [

    {
        path: '',
        component: TipoDocumentoTableComponent,
        data: { title: 'Tipos de Documentos' }
    },
    {
        path: 'add',
        component: TipoDocumentoFormComponent,
        data: { title: 'Crear Tipo de Documento' }
    },
    {
        path: ':id/edit',
        component: TipoDocumentoFormComponent,
        data: { title: 'Editar Tipo de Documento' }
    },
    {
        path: ':id/view',
        component: TipoDocumentoDetailComponent,
        data: { title: 'Visualizar Tipo de Documento' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoDocumentoRoutes)],
    exports: [RouterModule]
})
export class TipoDocumentoRoutingModule {
}

