import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresFormComponent } from './form/pago-proveedores.component';
const pagoproveedoresRoutes: Routes = [

 

    {
        path: '',
        component: ProveedoresFormComponent,
        data: { title: 'pago proveedores' }
    }, 

];

@NgModule({
    imports: [RouterModule.forChild(pagoproveedoresRoutes)],
    exports: [RouterModule]
})
export class pagoproveedoresRoutingModule {
}