import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaContableDetailComponent } from './detail/cuenta-contable-detail.component';
import { CuentaContableFormComponent } from './form/cuenta-contable-form.component';
import { CuentaContableTableComponent } from './table/cuenta-contable-table.component';



const cuentaContableRoutes: Routes = [

    {
        path: '',
        component: CuentaContableTableComponent,
        data: { title: 'Cuentas Contables' }
    },
    {
        path: 'add',
        component: CuentaContableFormComponent,
        data: { title: 'Crear Cuenta Contable' }
    },
    {
        path: ':id/edit',
        component: CuentaContableFormComponent,
        data: { title: 'Editar Cuenta Contable' }
    },
    {
        path: ':id/view',
        component: CuentaContableDetailComponent,
        data: { title: 'Visualizar Cuenta Contable' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(cuentaContableRoutes)],
    exports: [RouterModule]
})
export class CuentaContableRoutingModule {
}

