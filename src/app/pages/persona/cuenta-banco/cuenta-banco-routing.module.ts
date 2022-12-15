import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaBancoFormComponent } from './form/cuenta-banco-form.component';


const cuentaBancoRoutes: Routes = [

    {
        path: '',
        component: CuentaBancoFormComponent,
        data: { title: 'Apertura de Cuenta' }
    },
    {
        path: ':id/edit',
        component: CuentaBancoFormComponent,
        data: { title: 'Apertura de Cuenta' }
    },
];


@NgModule({
    imports: [RouterModule.forChild(cuentaBancoRoutes)],
    exports: [RouterModule]
})
export class CuentaBancoRoutingModule {
}

