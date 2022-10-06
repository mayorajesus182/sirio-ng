import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositoFormComponent } from './form/deposito-form.component';




const depositoRoutes: Routes = [

   {
        path: '',
        component: DepositoFormComponent,
        data: { title: 'Deposito' }
    },  


];


@NgModule({
    imports: [RouterModule.forChild(depositoRoutes)],
    exports: [RouterModule]
})
export class DepositoRoutingModule {
}

