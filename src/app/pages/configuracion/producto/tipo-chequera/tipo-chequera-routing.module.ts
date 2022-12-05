import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoChequeraDetailComponent } from './detail/tipo-chequera-detail.component';
import { TipoChequeraFormComponent } from './form/tipo-chequera-form.component';
import { TipoChequeraTableComponent } from './table/tipo-chequera-table.component';



const tipoChequeraRoutes: Routes = [

    {
        path: '',
        component: TipoChequeraTableComponent,
        data: { title: 'Tipos de Chequera' }
    },
    {
        path: 'add',
        component: TipoChequeraFormComponent,
        data: { title: 'Crear Tipo de Chequera' }
    },
    {
        path: ':id/edit',
        component: TipoChequeraFormComponent,
        data: { title: 'Editar Tipo de Chequera' }
    },
    {
        path: ':id/view',
        component: TipoChequeraDetailComponent,
        data: { title: 'Visualizar Tipo de Chequera' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tipoChequeraRoutes)],
    exports: [RouterModule]
})
export class TipoChequeraRoutingModule {
}

