import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetiroEfectivoFormComponent } from './efectivo/form/retiro-efectivo-form.component';
import { PagoChequeGerenciaFormComponent } from './pago-cheque-gerencia/form/pago-cheque-gerencia-form.component';
import { PagoChequeFormComponent } from './pago-cheque/form/pago-cheque-form.component';




const retiroRoutes: Routes = [

   {
        path: 'efectivo',
        component: RetiroEfectivoFormComponent,
        data: { title: 'Retiro Efectivo' }
    },  
   {
        path: 'cheque',
        component: PagoChequeFormComponent,
        data: { title: 'Pago Cheque' }
    },  
   {
        path: 'cheque-gerencia',
        component: PagoChequeGerenciaFormComponent,
        data: { title: 'Pago Cheque Gerencia' }
    },  


];


@NgModule({
    imports: [RouterModule.forChild(retiroRoutes)],
    exports: [RouterModule]
})
export class RetiroRoutingModule {
}

