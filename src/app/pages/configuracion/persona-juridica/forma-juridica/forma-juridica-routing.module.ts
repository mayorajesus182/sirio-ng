import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormaJuridicaDetailComponent } from './detail/forma-juridica-detail.component';
import { FormaJuridicaFormComponent } from './form/forma-juridica-form.component';
import { FormaJuridicaTableComponent } from './table/forma-juridica-table.component';


const formaJuridicaRoutes: Routes = [

    {
        path: '',
        component: FormaJuridicaTableComponent,
        data: { title: 'Forma Jurídicas' }
    },
    {
        path: 'add',
        component: FormaJuridicaFormComponent,
        data: { title: 'Crear Forma Jurídica' }
    },
    {
        path: ':id/edit',
        component: FormaJuridicaFormComponent,
        data: { title: 'Editar Forma Jurídica' }
    },
    {
        path: ':id/view',
        component: FormaJuridicaDetailComponent,
        data: { title: 'Visualizar Forma Jurídica' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(formaJuridicaRoutes)],
    exports: [RouterModule]
})
export class FormaJuridicaRoutingModule {
}

