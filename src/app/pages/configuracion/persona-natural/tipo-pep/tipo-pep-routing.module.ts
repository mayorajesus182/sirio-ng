import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoPepDetailComponent } from './detail/tipo-pep-detail.component';
import { TipoPepFormComponent } from './form/tipo-pep-form.component';
import { TipoPepTableComponent } from './table/tipo-pep-table.component';


const tipoPepRoutes: Routes = [

    {
        path: '',
        component: TipoPepTableComponent,
        data: { title: 'Tipos Pep' }
    },
    {
        path: 'add',
        component: TipoPepFormComponent,
        data: { title: 'Crear Tipo Pep' }
    },
    {
        path: ':id/edit',
        component: TipoPepFormComponent,
        data: { title: 'Editar Tipo Pep' }
    },
    {
        path: ':id/view',
        component: TipoPepDetailComponent,
        data: { title: 'Visualizar Tipo Pep' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(tipoPepRoutes)],
    exports: [RouterModule]
})
export class TipoPepRoutingModule {
}

