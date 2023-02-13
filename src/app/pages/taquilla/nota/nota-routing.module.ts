import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaDetailComponent } from './detail/nota-detail.component';
import { NotaFormComponent } from './form/nota-form.component';

import { NotaTableComponent } from './table/nota-table.component';





const notaRoutes: Routes = [

   {
        path: '', //formulario
        component: NotaFormComponent,
        data: { title: 'Nota' }
    },  
    {
        path: 'add',//table
        component: NotaTableComponent,
        data: { title: 'consultar Nota' }
    },
    {
        path: ':id/view',
        component: NotaDetailComponent,
        data: { title: 'Visualizar Nota' }
    },


];


@NgModule({
    imports: [RouterModule.forChild(notaRoutes)],
    exports: [RouterModule]
})
export class NotaRoutingModule {
}

